import { AssessmentEndedError } from '../errors.js';

export async function getNextChallenge({
  assessmentId,
  userId,
  locale,
  assessmentRepository,
  answerRepository,
  challengeRepository,
  evaluationUsecases,
  certificationEvaluationRepository,
}) {
  const assessment = await assessmentRepository.get(assessmentId);
  if (!assessment.isStarted()) {
    throw new AssessmentEndedError();
  }
  await assessmentRepository.updateLastQuestionDate({ id: assessment.id, lastQuestionDate: new Date() });

  let nextChallenge = null;
  const answers = await answerRepository.findByAssessment(assessment.id);
  const hasAnswered = hasAnsweredLatestChallengeAsked({
    answers,
    lastChallengeId: assessment.lastChallengeId,
  });
  if (!hasAnswered) {
    return challengeRepository.get(assessment.lastChallengeId);
  }
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

  if (nextChallenge && nextChallenge.id !== assessment.lastChallengeId) {
    await assessmentRepository.updateWhenNewChallengeIsAsked({
      id: assessment.id,
      lastChallengeId: nextChallenge.id,
    });
  }

  return nextChallenge;
}

function hasAnsweredLatestChallengeAsked({ answers, lastChallengeId }) {
  if (!lastChallengeId) {
    return true;
  }
  return answers.some((answer) => answer.challengeId === lastChallengeId);
}
