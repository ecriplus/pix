/**
 * @typedef {import('./index.js').Services} Services
 * @typedef {import('./index.js').AssessmentSheetRepository} AssessmentSheetRepository
 * @typedef {import('./index.js').CertificationCandidateRepository} CertificationCandidateRepository
 * @typedef {import('./index.js').SharedVersionRepository} SharedVersionRepository
 * @typedef {import('./index.js').AssessmentResultRepository} AssessmentResultRepository
 * @typedef {import('./index.js').sharedCompetenceMarkRepository} SharedCompetenceMarkRepository
 * @typedef {import('./index.js').CertificationAssessmentHistoryRepository} CertificationAssessmentHistoryRepository
 * @typedef {import('./index.js').CertificationCourseRepository} CertificationCourseRepository
 * @typedef {import('./index.js').ComplementaryCertificationCourseResultRepository} ComplementaryCertificationCourseResultRepository
 * @typedef {import('./index.js').ScoringConfigurationRepository} ScoringConfigurationRepository
 * @typedef {import('./index.js').EvaluationSessionRepository} EvaluationSessionRepository
 * @typedef {import('./index.js').ComplementaryCertificationScoringCriteriaRepository} ComplementaryCertificationScoringCriteriaRepository
 */

import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFinalizedSessionError, NotFoundError } from '../../../../shared/domain/errors.js';
import { SessionAlreadyPublishedError } from '../../../session-management/domain/errors.js';
import { CompetenceMark } from '../../../shared/domain/models/CompetenceMark.js';
import { ComplementaryCertificationCourseResult } from '../../../shared/domain/models/ComplementaryCertificationCourseResult.js';
import { CertificationAssessmentHistory } from '../models/CertificationAssessmentHistory.js';
import { FlashAssessmentAlgorithm } from '../models/FlashAssessmentAlgorithm.js';

/**
 * @param {object} params
 * @param {number} params.certificationCourseId
 * @param {Object} params.event
 * @param {Services} params.services
 * @param {AssessmentSheetRepository} params.assessmentSheetRepository
 * @param {CertificationCandidateRepository} params.certificationCandidateRepository
 * @param {SharedVersionRepository} params.sharedVersionRepository
 * @param {AssessmentResultRepository} params.assessmentResultRepository
 * @param {SharedCompetenceMarkRepository} params.sharedCompetenceMarkRepository
 * @param {CertificationAssessmentHistoryRepository} params.certificationAssessmentHistoryRepository
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 * @param {ComplementaryCertificationCourseResultRepository} params.complementaryCertificationCourseResultRepository
 * @param {ScoringConfigurationRepository} params.scoringConfigurationRepository
 * @param {EvaluationSessionRepository} params.evaluationSessionRepository
 * @param {ComplementaryCertificationScoringCriteriaRepository} params.complementaryCertificationScoringCriteriaRepository
 */
export async function scoreV3Certification ({
  event,
  certificationCourseId,
  services,
  assessmentSheetRepository,
  certificationCandidateRepository,
  sharedVersionRepository,
  assessmentResultRepository,
  sharedCompetenceMarkRepository,
  certificationAssessmentHistoryRepository,
  certificationCourseRepository,
  complementaryCertificationCourseResultRepository,
  scoringConfigurationRepository,
  evaluationSessionRepository,
  complementaryCertificationScoringCriteriaRepository,
}) {
  const assessmentSheet = await assessmentSheetRepository.findByCertificationCourseId(certificationCourseId);
  if (!assessmentSheet)
    throw new NotFoundError('No AssessmentSheet found for certificationCourseId ' + certificationCourseId);

  const candidate = await certificationCandidateRepository.findByAssessmentId({
    assessmentId: assessmentSheet.assessmentId,
  });

  const version = await sharedVersionRepository.getByScopeAndReconciliationDate({
    scope: candidate.subscriptionScope,
    reconciliationDate: candidate.reconciledAt,
  });

  await _verifyCertificationIsScorable({
    certificationCourseId: assessmentSheet.certificationCourseId,
    answers: assessmentSheet.answers,
    maximumAssessmentLength: version.challengesConfiguration.maximumAssessmentLength,
    evaluationSessionRepository,
  });

  const { allChallenges, askedChallengesWithoutLiveAlerts, challengeCalibrationsWithoutLiveAlerts } =
    await services.findCalibratedChallenges({
      certificationCourseId: assessmentSheet.certificationCourseId,
      assessmentId: assessmentSheet.assessmentId,
      version,
    });

  const algorithm = new FlashAssessmentAlgorithm({
    flashAlgorithmImplementation: services.flashAlgorithmService,
    configuration: version.challengesConfiguration,
  });

  const v3CertificationScoring = await scoringConfigurationRepository.getLatestByVersion({
    version,
  });

  const [cleaScoringCriteria] = await complementaryCertificationScoringCriteriaRepository.findByCertificationCourseId({
    certificationCourseId: assessmentSheet.certificationCourseId,
  });

  const { coreScoring, doubleCertificationScoring } = services.handleV3CertificationScoring({
    event,
    candidate,
    assessmentSheet,
    allChallenges,
    askedChallengesWithoutLiveAlerts,
    algorithm,
    v3CertificationScoring,
    cleaScoringCriteria,
  });

  const certificationAssessmentHistory = CertificationAssessmentHistory.fromChallengesAndAnswers({
    algorithm,
    challenges: challengeCalibrationsWithoutLiveAlerts,
    allAnswers: assessmentSheet.answers,
  });

  // We reduce the coverage of the transaction since, before that point, only reads are done
  await DomainTransaction.execute(async () => {
    await certificationAssessmentHistoryRepository.save(certificationAssessmentHistory);

    if (coreScoring) {
      await _saveV3Result({
        assessmentResult: coreScoring.assessmentResult,
        certificationCourseId: assessmentSheet.certificationCourseId,
        competenceMarks: coreScoring.competenceMarks,
        assessmentResultRepository,
        sharedCompetenceMarkRepository,
        certificationCourseRepository,
      });
    }

    if (doubleCertificationScoring) {
      await complementaryCertificationCourseResultRepository.save(
        ComplementaryCertificationCourseResult.from({
          complementaryCertificationCourseId: doubleCertificationScoring.complementaryCertificationCourseId,
          complementaryCertificationBadgeId: doubleCertificationScoring.complementaryCertificationBadgeId,
          source: doubleCertificationScoring.source,
          acquired: doubleCertificationScoring.isAcquired(),
        }),
      );
    }
  });
};

/**
 * @param {object} params
 * @param {number} params.certificationCourseId
 * @param {EvaluationSessionRepository} params.evaluationSessionRepository
 *
 * @returns {Promise<void>}
 * @throws {NotFinalizedSessionError}
 * @throws {SessionAlreadyPublishedError}
 */
const _verifyCertificationIsScorable = async ({
  certificationCourseId,
  answers,
  maximumAssessmentLength,
  evaluationSessionRepository,
}) => {
  const session = await evaluationSessionRepository.getByCertificationCourseId({ certificationCourseId });

  if (session.isPublished) {
    throw new SessionAlreadyPublishedError();
  }

  const hasCandidateSeenEndScreen = answers.length === maximumAssessmentLength;

  if (!session.isFinalized && !hasCandidateSeenEndScreen) {
    throw new NotFinalizedSessionError();
  }
};

/**
 * @param {object} params
 * @param {AssessmentResult} params.assessmentResult
 * @param {number} params.certificationCourseId
 * @param {CompetenceMark} params.competenceMarks
 * @param {AssessmentResultRepository} params.assessmentResultRepository
 * @param {sharedCompetenceMarkRepository} params.sharedCompetenceMarkRepository
 */
async function _saveV3Result({
  assessmentResult,
  certificationCourseId,
  competenceMarks,
  assessmentResultRepository,
  sharedCompetenceMarkRepository,
  certificationCourseRepository,
}) {
  const newAssessmentResult = await assessmentResultRepository.save({
    certificationCourseId,
    assessmentResult,
  });

  for (const competenceMark of competenceMarks) {
    const competenceMarkDomain = new CompetenceMark({
      ...competenceMark,
      assessmentResultId: newAssessmentResult.id,
    });
    await sharedCompetenceMarkRepository.save(competenceMarkDomain);
  }

  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });
  certificationCourse.complete({ now: new Date() });
  await certificationCourseRepository.update({ certificationCourse });
}
