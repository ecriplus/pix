import { setTimeout } from 'node:timers/promises';

import { knex } from '../../db/knex-database-connection.js';
import { Frameworks } from '../../src/certification/configuration/domain/models/Frameworks.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../src/shared/domain/DomainTransaction.js';
import { batchUpdate } from '../../src/shared/infrastructure/utils/knex-utils.js';

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_THROTTE_DELAY = 1000;
// fill ALL candidates
const DEFAULT_CANDIDATE_START_ID = 0;

export class FillEmptySubscriptionColumnsInCertificationCandidatesTable extends Script {
  constructor() {
    super({
      description: 'Subscription have been added to certification-candidate table. This script fill this column',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'Run the script without making any database changes',
          default: true,
        },
        startId: {
          type: 'number',
          describe: 'Define the id of the certification-candidates from which we start doing the process',
          default: DEFAULT_CANDIDATE_START_ID,
        },
        chunkSize: {
          type: 'number',
          describe:
            'Define the number of certifications processed in a chunk (chunks determined how many certifications are updated and committed at the same time)',
          default: DEFAULT_CHUNK_SIZE,
        },
        throttleDelay: {
          type: 'number',
          describe: 'The throttle delay',
          default: DEFAULT_THROTTE_DELAY,
        },
      },
    });
  }

  async handle({ logger, options }) {
    const { dryRun, startId, chunkSize, throttleDelay } = options;
    logger.info('Script execution started');

    let currentStartId = startId;
    let certificationCandidatesData = await selectCertificationCandidatesToProcess(currentStartId, chunkSize);
    while (certificationCandidatesData.length > 0) {
      const { certificationCandidatesToUpdate, latestCandidateIdProcessed } = await processCandidates(
        certificationCandidatesData,
        logger,
      );

      await DomainTransaction.execute(async () => {
        const trx = DomainTransaction.getConnection();
        try {
          await batchUpdate({
            tableName: 'certification-candidates',
            primaryKeyName: 'id',
            rows: certificationCandidatesToUpdate,
          });

          logger.info(`Certification candidates up until ID ${latestCandidateIdProcessed} DONE`);
          if (dryRun) {
            await trx.rollback();
          } else {
            await trx.commit();
          }
        } catch (error) {
          await trx.rollback();
          throw error;
        }
      });

      await setTimeout(throttleDelay);
      currentStartId = latestCandidateIdProcessed + 1;
      certificationCandidatesData = await selectCertificationCandidatesToProcess(currentStartId, chunkSize);
    }

    logger.info('No more certification candidates to process, youpi !');
  }
}

async function selectCertificationCandidatesToProcess(startId, chunkSize) {
  return await knex
    .select('certification-candidates.id', 'certification-subscriptions.type', 'complementary-certifications.key')
    .from('certification-candidates')
    .join('certification-subscriptions', function () {
      this.on({ 'certification-candidates.id': 'certification-subscriptions.certificationCandidateId' });
    })
    .leftJoin(
      'complementary-certifications',
      'complementary-certifications.id',
      'certification-subscriptions.complementaryCertificationId',
    )
    .whereNull('certification-candidates.subscription')
    .where('certification-candidates.id', '>=', startId)
    .limit(chunkSize);
}

async function processCandidates(certificationCandidatesData, logger) {
  let latestCandidateIdProcessed;
  const certificationCandidatesToUpdate = [];
  logger.info(
    `Processing certification candidate from ${certificationCandidatesData[0].id} to ${certificationCandidatesData.at(-1).id}...`,
  );
  for (const certificationCandidateData of certificationCandidatesData) {
    try {
      latestCandidateIdProcessed = certificationCandidateData.id;

      const subscription = certificationCandidateData.key || Frameworks.CORE;
      const cerficationCandidateData = { id: certificationCandidateData.id, subscription };
      certificationCandidatesToUpdate.push(cerficationCandidateData);
    } catch (error) {
      logger.error(error, `Candidate ID ${latestCandidateIdProcessed} encountered an error`);
      throw error;
    }
  }
  return {
    certificationCandidatesToUpdate: certificationCandidatesToUpdate.filter((cca) => !!cca),
    latestCandidateIdProcessed,
  };
}
await ScriptRunner.execute(import.meta.url, FillEmptySubscriptionColumnsInCertificationCandidatesTable);
