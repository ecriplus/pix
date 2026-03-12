import { knex } from '../../db/knex-database-connection.js';
import { Frameworks } from '../../src/certification/configuration/domain/models/Frameworks.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../src/shared/domain/DomainTransaction.js';
import { batchUpdate } from '../../src/shared/infrastructure/utils/knex-utils.js';

export class FillNewColumnsInCertificationCoursesAndCandidatesTables extends Script {
  constructor() {
    super({
      description:
        'CandidateId and versionId are two new columns recently added in certification-courses table, and subscription have been added to certification-candidate table. This script fills those columns',
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
          default: 5906059,
        },
        chunkSize: {
          type: 'number',
          describe:
            'Define the number of certifications processed in a chunk (chunks determined how many certifications are updated and committed at the same time)',
          default: 1000,
        },
      },
    });
  }

  async handle({ logger, options }) {
    const { dryRun, startId, chunkSize } = options;
    logger.info('Script execution started');
    const certificationFrameworkVersions = await getVersions();

    let currentStartId = startId;
    let certificationsData = await selectCertificationsToProcess(currentStartId, chunkSize);
    while (certificationsData.length > 0) {
      const { certificationCoursesToUpdate, certificationCandidatesToUpdate, latestCertificationIdProcessed } =
        await processCertifications(certificationsData, certificationFrameworkVersions, logger);

      await DomainTransaction.execute(async () => {
        const trx = DomainTransaction.getConnection();
        try {
          await batchUpdate({
            tableName: 'certification-courses',
            primaryKeyName: 'id',
            rows: certificationCoursesToUpdate,
          });
          await batchUpdate({
            tableName: 'certification-candidates',
            primaryKeyName: 'id',
            rows: certificationCandidatesToUpdate,
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

      currentStartId = latestCertificationIdProcessed + 1;
      certificationsData = await selectCertificationsToProcess(currentStartId, chunkSize);
    }

    logger.info('No more certifications to process youpi');
  }
}

async function getVersions() {
  const versionsData = await knex('certification_versions')
    .select('id', 'startDate', 'expirationDate', 'scope')
    .orderByRaw('"expirationDate" ASC NULLS LAST');

  const v3CertificationFrameworkVersion = [];
  for (const versionData of versionsData) {
    const data = {
      id: versionData.id,
      startDate: versionData.startDate,
      expirationDate: versionData.expirationDate,
      scope: versionData.scope,
    };
    v3CertificationFrameworkVersion.push(data);
  }

  return v3CertificationFrameworkVersion;
}

async function selectCertificationsToProcess(startId, chunkSize) {
  return await knex
    .select({
      certificationCourseId: 'certification-courses.id',
      certificationCourseVersion: 'certification-courses.version',
      candidateId: 'certification-candidates.id',
      reconciledAt: 'certification-candidates.reconciledAt',
      subscriptionKeys: knex.raw(
        `json_agg(
          "complementary-certifications"."key"
          ORDER BY "complementary-certifications".key NULLS LAST
        )`,
      ),
    })
    .from('certification-courses')
    .join('certification-candidates', function () {
      this.on({ 'certification-candidates.sessionId': 'certification-courses.sessionId' }).andOn({
        'certification-candidates.userId': 'certification-courses.userId',
      });
    })
    .leftJoin(
      'certification-subscriptions',
      'certification-subscriptions.certificationCandidateId',
      'certification-candidates.id',
    )
    .leftJoin(
      'complementary-certifications',
      'complementary-certifications.id',
      'certification-subscriptions.complementaryCertificationId',
    )
    .where('certification-courses.id', '>=', startId)
    .where('certification-courses.version', 3)
    .where('certification-courses.versionId', null)
    .groupBy('certification-courses.id', 'certification-candidates.id')
    .orderBy('certification-courses.id', 'asc')
    .limit(chunkSize);
}

async function processCertifications(certificationsData, certificationFrameworkVersions, logger) {
  let latestCertificationIdProcessed;
  const certificationCoursesToUpdate = [];
  const certificationCandidatesToUpdate = [];
  logger.info(
    `Processing certification from ${certificationsData[0].certificationCourseId} to ${certificationsData.at(-1).certificationCourseId}...`,
  );
  for (const certificationData of certificationsData) {
    try {
      latestCertificationIdProcessed = certificationData.certificationCourseId;

      const subscription = certificationData.subscriptionKeys[0] || Frameworks.CORE;
      const cerficationCandidateData = { id: certificationData.candidateId, subscription };
      certificationCandidatesToUpdate.push(cerficationCandidateData);

      const scope = subscription == Frameworks.CLEA ? Frameworks.CORE : subscription;
      const versionId = findCorrespondingVersionId(
        certificationFrameworkVersions,
        certificationData.reconciledAt,
        scope,
      );
      const certificationCourseData = {
        id: certificationData.certificationCourseId,
        candidateId: certificationData.candidateId,
        versionId,
      };
      certificationCoursesToUpdate.push(certificationCourseData);
    } catch (error) {
      logger.error(error, `Certification ID ${latestCertificationIdProcessed} encountered an error`);
      throw error;
    }
  }
  return {
    certificationCoursesToUpdate: certificationCoursesToUpdate.filter((cco) => !!cco),
    certificationCandidatesToUpdate: certificationCandidatesToUpdate.filter((cca) => !!cca),
    latestCertificationIdProcessed,
  };
}

function findCorrespondingVersionId(v3CertificationFrameworkVersions, reconciledAt, scope) {
  for (const v3CertificationFrameworkVersion of v3CertificationFrameworkVersions) {
    if (
      scope == v3CertificationFrameworkVersion.scope &&
      reconciledAt >= v3CertificationFrameworkVersion.startDate &&
      (v3CertificationFrameworkVersion.expirationDate === null ||
        reconciledAt < v3CertificationFrameworkVersion.expirationDate)
    ) {
      return v3CertificationFrameworkVersion.id;
    }
  }

  throw new Error(`No Version found for ${reconciledAt} date.`);
}

await ScriptRunner.execute(import.meta.url, FillNewColumnsInCertificationCoursesAndCandidatesTables);
