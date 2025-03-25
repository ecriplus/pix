export async function getNextChallenge({
  assessmentId,
  userId,
  locale,
  assessmentRepository,
  evaluationUsecases,
  certificationVersionRepository,
}) {
  const assessment = await assessmentRepository.get(assessmentId);

  if (assessment.isStarted()) {
    await assessmentRepository.updateLastQuestionDate({ id: assessment.id, lastQuestionDate: new Date() });
  }

  let nextChallenge = null;
  if (assessment.isCertification()) {
    nextChallenge = await certificationVersionRepository.selectNextCertificationChallenge({
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
