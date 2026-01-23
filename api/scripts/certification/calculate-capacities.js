import { knex } from '../../db/knex-database-connection.js';
import { FlashAssessmentAlgorithm } from '../../src/certification/evaluation/domain/models/FlashAssessmentAlgorithm.js';
import * as flashAlgorithmService from '../../src/certification/evaluation/domain/services/algorithm-methods/flash.js';
import { services as certificationEvaluationServices } from '../../src/certification/evaluation/domain/services/index.js';
import * as certificationAssessmentHistoryRepository from '../../src/certification/evaluation/infrastructure/repositories/certification-assessment-history-repository.js';
import * as certificationCandidateRepository from '../../src/certification/evaluation/infrastructure/repositories/certification-candidate-repository.js';
import { CertificationAssessmentHistory } from '../../src/certification/scoring/domain/models/CertificationAssessmentHistory.js';
import * as certificationAssessmentRepository from '../../src/certification/shared/infrastructure/repositories/certification-assessment-repository.js';
import * as certificationCourseRepository from '../../src/certification/shared/infrastructure/repositories/certification-course-repository.js';
import * as sharedVersionRepository from '../../src/certification/shared/infrastructure/repositories/version-repository.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../src/shared/domain/DomainTransaction.js';
import * as answerRepository from '../../src/shared/infrastructure/repositories/answer-repository.js';

export class CalculateCapacities extends Script {
  constructor() {
    super({
      description: 'Calculate capacities for Pix Plus',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'Run the script without making any database changes',
          default: true,
        },
      },
    });
  }

  async handle({ logger, options, computeCapacitiesFnc }) {
    const computeCapacitiesVerySad = computeCapacitiesFnc ?? computeCapacities;
    const { dryRun } = options;

    const data = await knex.raw(
      `select cv.*, cco.id course_id
        from "certification-subscriptions" cs
        join "certification-candidates" cca on cca.id = cs."certificationCandidateId"
        join "certification-courses" cco on (cco."userId" = cca."userId" and cco."sessionId" = cca."sessionId")
        join "sessions" on sessions.id = cco."sessionId"
        join "complementary-certifications" cc on cc.id = cs."complementaryCertificationId"
        join certification_versions cv on cv.scope = cc.key
        where cv.scope != 'CORE' and cv."startDate" is not null and cv."expirationDate" is null and
        cs.type = 'COMPLEMENTARY' and cca."reconciledAt" > cv."startDate" and sessions."finalizedAt" is not null
        order by cv.id, course_id`,
    );

    const groupedData = Object.groupBy(data.rows, (item) => item.id);

    for (const certifications of Object.values(groupedData)) {
      logger.info(
        `About to compute capacities for certification ${certifications[0].scope} for ${certifications.length} candidates`,
      );
      const algorithm = new FlashAssessmentAlgorithm({
        flashAlgorithmImplementation: flashAlgorithmService,
        configuration: certifications[0].challengesConfiguration,
      });
      let countSuccesses = 0;
      let currentCertificationCourseId;

      for (const certification of certifications) {
        try {
          currentCertificationCourseId = certification.course_id;
          await DomainTransaction.execute(async () => {
            await computeCapacitiesVerySad(currentCertificationCourseId, algorithm);
            countSuccesses++;
            if (dryRun) {
              throw new Error('dryRun');
            }
          });
        } catch (error) {
          if (error.message !== 'dryRun') {
            logger.error(
              `An error occurred when computing capacities for certification ${currentCertificationCourseId}, error : ${error?.stack || error}`,
            );
          }
        }
      }
      logger.info(
        `Successfully computed capacities for certification ${certifications[0].scope} for ${countSuccesses}/${certifications.length} candidates`,
      );
    }
  }
}

async function computeCapacities(certificationCourseId, algorithm) {
  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
    certificationCourseId,
  });

  const answers = await answerRepository.findByAssessment(certificationAssessment.id);

  const candidate = await certificationCandidateRepository.findByAssessmentId({
    assessmentId: certificationAssessment.id,
  });

  const version = await sharedVersionRepository.getByScopeAndReconciliationDate({
    scope: candidate.subscriptionScope,
    reconciliationDate: candidate.reconciledAt,
  });

  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });
  const { challengeCalibrationsWithoutLiveAlerts } =
    await certificationEvaluationServices.findByCertificationCourseAndVersion({
      certificationCourse: certificationCourse,
      version,
    });

  const certificationAssessmentHistory = CertificationAssessmentHistory.fromChallengesAndAnswers({
    algorithm,
    challenges: challengeCalibrationsWithoutLiveAlerts,
    allAnswers: answers,
  });

  await certificationAssessmentHistoryRepository.save(certificationAssessmentHistory);
}

await ScriptRunner.execute(import.meta.url, CalculateCapacities);
