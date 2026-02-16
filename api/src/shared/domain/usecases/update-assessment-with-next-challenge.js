import { logger } from '../../infrastructure/utils/logger.js';
import { AssessmentEndedError, AssessmentLackOfChallengesError, NotFoundError } from '../errors.js';

export async function updateAssessmentWithNextChallenge({
  assessment,
  userId,
  locale,
  evaluationUsecases,
  assessmentRepository,
  certificationEvaluationRepository,
  courseRepository,
}) {
  if (!assessment.isStarted()) {
    assessment.nextChallenge = null;
    return assessment;
  }
  await assessmentRepository.updateLastQuestionDate({ id: assessment.id, lastQuestionDate: new Date() });

  let nextChallenge = null;
  try {
    if (assessment.isCertification()) {
      nextChallenge = await certificationEvaluationRepository.selectNextCertificationChallenge({
        assessmentId: assessment.id,
        locale,
      });
    }

    if (assessment.isPreview()) {
      nextChallenge = await evaluationUsecases.getNextChallengeForPreview({});
    }

    if (assessment.isDemo()) {
      const course = await courseRepository.get(assessment.courseId);
      if (!course.canBePlayed) {
        throw new NotFoundError("Le test demandé n'existe pas");
      }
      assessment.title = course.name;
      nextChallenge = await evaluationUsecases.getNextChallengeForDemo({ assessment });
    }

    if (assessment.isForCampaign()) {
      nextChallenge = await evaluationUsecases.getNextChallengeForCampaignAssessment({ assessment, locale });
    }
    if (assessment.isCompetenceEvaluation()) {
      nextChallenge = await evaluationUsecases.getNextChallengeForCompetenceEvaluation({ assessment, userId, locale });
    }
  } catch (error) {
    if (error instanceof AssessmentLackOfChallengesError) {
      logger.warn(
        {
          assessmentId: assessment.id,
          numberOfAnswers: error.numberOfAnswers,
          maximumAssessmentLength: error.maximumAssessmentLength,
        },
        'Assessment ended prematurely: no challenge remaining before reaching maximum assessment length',
      );
      nextChallenge = null;
    } else if (error instanceof AssessmentEndedError) {
      nextChallenge = null;
    } else {
      logger.error(
        { assessmentId: assessment.id, assessmentType: assessment.type, err: error },
        'Unexpected error while retrieving next challenge for assessment',
      );
      throw error;
    }
  }

  if (nextChallenge && nextChallenge.id !== assessment.lastChallengeId) {
    await assessmentRepository.updateWhenNewChallengeIsAsked({
      id: assessment.id,
      lastChallengeId: nextChallenge.id,
    });
  }
  assessment.nextChallenge = nextChallenge;

  return assessment;
}
