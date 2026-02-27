import { knex } from '../../db/knex-database-connection.js';
import { Frameworks } from '../../src/certification/configuration/domain/models/Frameworks.js';
import { CapacitySimulator } from '../../src/certification/evaluation/domain/models/CapacitySimulator.js';
import { Intervals } from '../../src/certification/evaluation/domain/models/Intervals.js';
import { V3CertificationScoring } from '../../src/certification/evaluation/domain/models/V3CertificationScoring.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import * as areaRepository from '../../src/shared/infrastructure/repositories/area-repository.js';
import * as competenceRepository from '../../src/shared/infrastructure/repositories/competence-repository.js';

export class FillCapacityMeshindexVersionidColumnsInAssessmentResultsTable extends Script {
  constructor() {
    super({
      description:
        'Capacity, reachedMeshIndex and versionId are three new columns recently added in assessment-results table. This script fills those columns',
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
    const coreScoringConfigurations = await getCoreScoringConfigurations();

    let currentStartId = startId;
    let certificationsData = await selectCertificationsToProcess(currentStartId, chunkSize);
    while (certificationsData.length > 0) {
      const { assessmentResultsToUpdate, latestCertificationIdProcessed } = await processCertifications(
        certificationsData,
        coreScoringConfigurations,
        logger,
      );

      const trx = await knex.transaction();
      try {
        await trx('assessment-results').insert(assessmentResultsToUpdate).onConflict('id').merge();
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

      currentStartId = latestCertificationIdProcessed + 1;
      certificationsData = await selectCertificationsToProcess(currentStartId, chunkSize);
    }

    logger.info('No more certifications to process youpi');
  }
}

async function getCoreScoringConfigurations() {
  const allAreas = await areaRepository.list();
  const competenceList = await competenceRepository.listPixCompetencesOnly();

  const versionsData = await knex('certification_versions')
    .select(
      'id',
      'startDate',
      'expirationDate',
      'globalScoringConfiguration',
      'competencesScoringConfiguration',
      'minimumAnswersRequiredToValidateACertification',
    )
    .where({
      scope: Frameworks.CORE,
    })
    .orderByRaw('"expirationDate" ASC NULLS LAST');

  const v3CertificationScorings = [];
  for (const versionData of versionsData) {
    const scoringConfiguration = V3CertificationScoring.fromConfigurations({
      competenceForScoringConfiguration: versionData.competencesScoringConfiguration,
      certificationScoringConfiguration: versionData.globalScoringConfiguration,
      allAreas,
      competenceList,
      minimumAnswersRequiredToValidateACertification: versionData.minimumAnswersRequiredToValidateACertification,
    });
    const data = {
      id: versionData.id,
      startDate: versionData.startDate,
      expirationDate: versionData.expirationDate,
      scoringConfiguration,
    };
    v3CertificationScorings.push(data);
  }

  return v3CertificationScorings;
}

async function selectCertificationsToProcess(startId, chunkSize) {
  return await knex
    .select({
      certificationCourseId: 'certification-courses.id',
      reconciledAt: 'certification-candidates.reconciledAt',
    })
    .from('certification-courses')
    .join('certification-candidates', function () {
      this.on({ 'certification-candidates.sessionId': 'certification-courses.sessionId' }).andOn({
        'certification-candidates.userId': 'certification-courses.userId',
      });
    })
    .where('certification-courses.version', 3)
    .where('certification-courses.id', '>=', startId)
    .orderBy('certification-courses.id', 'asc')
    .limit(chunkSize);
}

async function processCertifications(certificationsData, coreScoringConfigurations, logger) {
  let latestCertificationIdProcessed;
  const assessmentResultsToUpdate = [];
  logger.info(
    `Processing certification from ${certificationsData[0].certificationCourseId} to ${certificationsData.at(-1).certificationCourseId}...`,
  );
  for (const certificationData of certificationsData) {
    try {
      latestCertificationIdProcessed = certificationData.certificationCourseId;
      const assessmentResultData = await processCertification(coreScoringConfigurations, certificationData);
      assessmentResultsToUpdate.push(assessmentResultData);
    } catch (error) {
      logger.error(error, `Certification ID ${latestCertificationIdProcessed} encountered an error`);
      throw error;
    }
  }
  return {
    assessmentResultsToUpdate: assessmentResultsToUpdate.filter((ar) => !!ar),
    latestCertificationIdProcessed,
  };
}

async function processCertification(v3CertificationScorings, certificationData) {
  const coreScoringConfiguration = findCorrespondingCoreScoringConfiguration(
    v3CertificationScorings,
    certificationData.reconciledAt,
  );

  const assessmentResultData = await knex
    .select('assessment-results.*')
    .from('assessment-results')
    .join(
      'certification-courses-last-assessment-results',
      'certification-courses-last-assessment-results.lastAssessmentResultId',
      'assessment-results.id',
    )
    .where(
      'certification-courses-last-assessment-results.certificationCourseId',
      certificationData.certificationCourseId,
    )
    .first();
  if (!assessmentResultData) {
    return null;
  }

  const capacity = computeCapacityFromPixScore(
    assessmentResultData.pixScore,
    coreScoringConfiguration.scoringConfiguration,
  );
  const reachedMeshIndex = computeMeshIndexFromCapacity(capacity, coreScoringConfiguration.scoringConfiguration);
  const versionId = coreScoringConfiguration.id;

  return {
    ...assessmentResultData,
    capacity,
    reachedMeshIndex,
    versionId,
  };
}

function findCorrespondingCoreScoringConfiguration(v3CertificationScorings, reconciledAt) {
  for (const v3CertificationScoring of v3CertificationScorings) {
    if (
      reconciledAt >= v3CertificationScoring.startDate &&
      (v3CertificationScoring.expirationDate === null || reconciledAt < v3CertificationScoring.expirationDate)
    ) {
      return v3CertificationScoring;
    }
  }

  throw new Error(`No Certification Scoring found for ${reconciledAt} date.`);
}

function computeCapacityFromPixScore(pixScore, scoringConfiguration) {
  const certificationScoringIntervals = scoringConfiguration.intervals;
  const maxReachableLevel = scoringConfiguration.maxReachableLevel;
  return CapacitySimulator.compute({
    score: pixScore,
    certificationScoringIntervals,
    competencesForScoring: scoringConfiguration.competencesForScoring,
    maxReachableLevel,
  }).capacity;
}

function computeMeshIndexFromCapacity(capacity, scoringConfiguration) {
  const certificationScoringIntervals = scoringConfiguration.intervals;
  const scoringIntervals = new Intervals({ intervals: certificationScoringIntervals });
  return scoringIntervals.findIntervalIndexFromCapacity(capacity);
}

await ScriptRunner.execute(import.meta.url, FillCapacityMeshindexVersionidColumnsInAssessmentResultsTable);
