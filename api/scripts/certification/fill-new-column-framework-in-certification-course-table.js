import { setTimeout } from 'node:timers/promises';

import { knex } from '../../db/knex-database-connection.js';
import { Frameworks } from '../../src/certification/configuration/domain/models/Frameworks.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../src/shared/domain/DomainTransaction.js';
import { batchUpdate } from '../../src/shared/infrastructure/utils/knex-utils.js';

export class FillNewColumnFrameworkInCertificationCourseTable extends Script {
  constructor() {
    super({
      description:
        'Filling "framework" and "candidateId" columns in certification-courses table. For the "candidateId" column, it is already partially filled by a previous script, but not for v2 certifications',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'Run the script without making any database changes',
          default: true,
        },
        startId: {
          type: 'number',
          describe: 'Define the id of the certification-courses from which we start doing the process',
          default: 1,
        },
        chunkSize: {
          type: 'number',
          describe:
            'Define the number of certifications processed in a chunk (chunks determined how many certifications are updated and committed at the same time)',
          default: 3000,
        },
        throttleDelay: {
          type: 'number',
          describe: 'The throttle delay',
          default: 250,
        },
      },
    });
  }

  async handle({ logger, options }) {
    const { dryRun, startId, chunkSize, throttleDelay } = options;
    logger.info('Script execution started');

    let currentStartId = startId;
    let certificationsData = await selectCertificationsToProcess(currentStartId, chunkSize);
    while (certificationsData.length > 0) {
      const { certificationCoursesToUpdate, latestCertificationIdProcessed } = await processCertifications(
        certificationsData,
        logger,
      );

      await DomainTransaction.execute(async () => {
        const trx = DomainTransaction.getConnection();
        try {
          await batchUpdate({
            tableName: 'certification-courses',
            primaryKeyName: 'id',
            rows: certificationCoursesToUpdate,
          });

          logger.info(`Certifications up until ID ${latestCertificationIdProcessed} DONE`);
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
      currentStartId = latestCertificationIdProcessed + 1;
      certificationsData = await selectCertificationsToProcess(currentStartId, chunkSize);
    }

    logger.info('No more certifications to process youpi');
  }
}

async function selectCertificationsToProcess(startId, chunkSize) {
  return knex
    .select({
      certificationCourseId: 'certification-courses.id',
      candidateId: 'certification-candidates.id',
      complementaryCertificationKeys: knex.raw(
        `json_agg(
          "complementary-certifications"."key"
          ORDER BY "complementary-certifications".key NULLS LAST
        )`,
      ),
    })
    .from('certification-courses')
    .leftJoin('certification-candidates', function () {
      this.on({ 'certification-candidates.sessionId': 'certification-courses.sessionId' }).andOn({
        'certification-candidates.userId': 'certification-courses.userId',
      });
    })
    .leftJoin(
      'complementary-certification-courses',
      'complementary-certification-courses.certificationCourseId',
      'certification-courses.id',
    )
    .leftJoin(
      'complementary-certifications',
      'complementary-certifications.id',
      'complementary-certification-courses.complementaryCertificationId',
    )
    .where('certification-courses.id', '>=', startId)
    .whereNull('certification-courses.framework')
    .groupBy('certification-courses.id', 'certification-candidates.id')
    .orderBy('certification-courses.id', 'asc')
    .limit(chunkSize);
}

async function processCertifications(certificationsData, logger) {
  let latestCertificationIdProcessed;
  const certificationCoursesToUpdate = [];
  logger.info(
    `Processing certification from ${certificationsData[0].certificationCourseId} to ${certificationsData.at(-1).certificationCourseId}...`,
  );
  for (const certificationData of certificationsData) {
    try {
      latestCertificationIdProcessed = certificationData.certificationCourseId;

      const certificationCourseData = {
        id: certificationData.certificationCourseId,
        candidateId: certificationData.candidateId ?? null,
        framework: certificationData.complementaryCertificationKeys?.[0] ?? Frameworks.CORE,
      };
      certificationCoursesToUpdate.push(certificationCourseData);
    } catch (error) {
      logger.error(error, `Certification ID ${latestCertificationIdProcessed} encountered an error`);
      throw error;
    }
  }
  return {
    certificationCoursesToUpdate: certificationCoursesToUpdate.filter((cco) => !!cco),
    latestCertificationIdProcessed,
  };
}

await ScriptRunner.execute(import.meta.url, FillNewColumnFrameworkInCertificationCourseTable);
