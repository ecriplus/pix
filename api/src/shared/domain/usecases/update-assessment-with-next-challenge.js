export async function updateAssessmentWithNextChallenge({
  assessment,
  userId,
  locale,
  assessmentRepository,
  challengeRepository,
  evaluationUsecases,
  certificationEvaluationRepository,
}) {
  if (!assessment.isStarted()) {
    assessment.nextChallenge = null;
    return assessment;
  }
  await assessmentRepository.updateLastQuestionDate({ id: assessment.id, lastQuestionDate: new Date() });

  let nextChallenge = null;
  let waitingForLatestChallengeAnswer;
  if (assessment.isCertification()) {
    // Force executing the usecase because of the live alert system
    waitingForLatestChallengeAnswer = false;
  } else {
    waitingForLatestChallengeAnswer = checkIfLatestChallengeOfAssessmentIsAwaitingToBeAnswered({
      answers: assessment.answers,
      lastChallengeId: assessment.lastChallengeId,
    });
  }
  if (waitingForLatestChallengeAnswer) {
    nextChallenge = await challengeRepository.get(assessment.lastChallengeId);
    if (nextChallenge.isOperative) {
      assessment.nextChallenge = nextChallenge;
      return assessment;
    } else {
      nextChallenge = null;
    }
  }

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
      nextChallenge = await evaluationUsecases.getNextChallengeForDemo({ assessment });
    }

    if (assessment.isForCampaign()) {
      nextChallenge = await evaluationUsecases.getNextChallengeForCampaignAssessment({ assessment, locale });
    }
    if (assessment.isCompetenceEvaluation()) {
      nextChallenge = await evaluationUsecases.getNextChallengeForCompetenceEvaluation({ assessment, userId, locale });
    }
  } catch {
    nextChallenge = null;
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

function checkIfLatestChallengeOfAssessmentIsAwaitingToBeAnswered({ answers, lastChallengeId }) {
  if (!lastChallengeId) {
    return false;
  }
  return !answers.some((answer) => answer.challengeId === lastChallengeId);
}
