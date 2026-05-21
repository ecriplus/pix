import { logger } from '../../infrastructure/utils/logger.js';
import {
  AssessmentEndedError,
  AssessmentLackOfChallengesError,
  CampaignParticipationDeletedError,
  NotFoundError,
} from '../errors.js';

export async function updateAssessmentWithNextChallenge({
  assessmentId,
  userId,
  locale,
  evaluationUsecases,
  assessmentRepository,
  certificationEvaluationRepository,
  courseRepository,
  challengeToPlayApi,
  competenceRepository,
  certificationChallengeLiveAlertRepository,
  certificationCompanionAlertRepository,
}) {
  const assessment = await assessmentRepository.getWithAnswers(assessmentId);
  assessment.nextChallenge = null;
  let globalProgression = null;
  let nextChallengeId = null;
  try {
    if (assessment.isCertification()) {
      const challengeLiveAlerts = await certificationChallengeLiveAlertRepository.getByAssessmentId({
        assessmentId: assessment.id,
      });
      const companionLiveAlerts = await certificationCompanionAlertRepository.getAllByAssessmentId({
        assessmentId: assessment.id,
      });
      assessment.attachLiveAlerts({ challengeLiveAlerts, companionLiveAlerts });
      if (assessment.isStarted()) {
        nextChallengeId = await certificationEvaluationRepository.selectNextCertificationChallenge({
          assessmentId: assessment.id,
        });
      }
    }

    if (assessment.isPreview() && assessment.isStarted()) {
      throw new AssessmentEndedError();
    }

    if (assessment.isDemo()) {
      const course = await courseRepository.get(assessment.courseId);
      if (!course.canBePlayed) {
        throw new NotFoundError("Le test demandé n'existe pas");
      }
      assessment.title = course.name;
      if (assessment.isStarted()) {
        nextChallengeId = await evaluationUsecases.getNextChallengeForDemo({ assessment });
      }
    }

    if (assessment.isForCampaign() && assessment.isStarted()) {
      if (!assessment.campaignParticipationId)
        throw new CampaignParticipationDeletedError(
          `Cannot continue assessement: ${assessmentId} on deleted participation`,
        );
      if (assessment.isForExamCampaign()) {
        const progression = await evaluationUsecases.getProgression({
          progressionId: assessmentId.toString(),
          userId,
        });
        globalProgression = progression.completionRate;
      }
      nextChallengeId = await evaluationUsecases.getNextChallengeForCampaignAssessment({ assessment, locale });
    }

    if (assessment.isCompetenceEvaluation()) {
      assessment.title = await competenceRepository.getCompetenceName({ id: assessment.competenceId, locale });
      if (assessment.isStarted()) {
        nextChallengeId = await evaluationUsecases.getNextChallengeForCompetenceEvaluation({
          assessment,
          userId,
          locale,
        });
      }
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
      assessment.nextChallenge = null;
    } else if (error instanceof AssessmentEndedError) {
      assessment.nextChallenge = null;
    } else {
      logger.error(
        { assessmentId: assessment.id, assessmentType: assessment.type, err: error },
        'Unexpected error while retrieving next challenge for assessment',
      );
      throw error;
    }
  }

  if (!nextChallengeId) {
    return {
      assessment,
      globalProgression,
    };
  }
  await assessmentRepository.updateLastQuestionDate({ id: assessment.id, lastQuestionDate: new Date() });
  if (nextChallengeId !== assessment.lastChallengeId) {
    await assessmentRepository.updateWhenNewChallengeIsAsked({
      id: assessment.id,
      lastChallengeId: nextChallengeId,
    });
  }

  assessment.nextChallenge = await challengeToPlayApi.get(nextChallengeId);

  return {
    assessment,
    globalProgression,
  };
}
