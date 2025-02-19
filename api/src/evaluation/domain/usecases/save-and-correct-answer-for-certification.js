import { AnswerJob } from '../../../quest/domain/models/AnwserJob.js';
import {
  CertificationEndedByFinalizationError,
  CertificationEndedBySupervisorError,
  ForbiddenAccess,
} from '../../../shared/domain/errors.js';
import { ChallengeNotAskedError } from '../../../shared/domain/errors.js';
import { EmptyAnswerError } from '../errors.js';

export async function saveAndCorrectAnswerForCertification({
  answer,
  userId,
  assessment,
  forceOKAnswer = false,
  answerRepository,
  answerJobRepository,
  challengeRepository,
  certificationChallengeLiveAlertRepository,
  certificationEvaluationCandidateRepository,
  correctionService,
  dateUtils,
} = {}) {
  if (assessment.userId !== userId) {
    throw new ForbiddenAccess('User is not allowed to add an answer for this assessment.');
  }
  if (assessment.isEndedBySupervisor()) {
    throw new CertificationEndedBySupervisorError();
  }
  if (assessment.hasBeenEndedDueToFinalization()) {
    throw new CertificationEndedByFinalizationError();
  }
  if (assessment.lastChallengeId && assessment.lastChallengeId != answer.challengeId) {
    throw new ChallengeNotAskedError();
  }
  if (!answer.hasValue && !answer.hasTimedOut) {
    throw new EmptyAnswerError();
  }

  const challenge = await challengeRepository.get(answer.challengeId);
  const ongoingOrValidatedCertificationChallengeLiveAlert =
    await certificationChallengeLiveAlertRepository.getOngoingOrValidatedByChallengeIdAndAssessmentId({
      challengeId: challenge.id,
      assessmentId: assessment.id,
    });

  if (ongoingOrValidatedCertificationChallengeLiveAlert) {
    throw new ForbiddenAccess('An alert has been set.');
  }

  const certificationCandidate = await certificationEvaluationCandidateRepository.findByAssessmentId({
    assessmentId: assessment.id,
  });
  const correctedAnswer = correctionService.evaluateAnswer({
    challenge,
    answer,
    assessment,
    accessibilityAdjustmentNeeded: certificationCandidate.accessibilityAdjustmentNeeded,
    forceOKAnswer,
  });
  const now = dateUtils.getNowDate();
  const lastQuestionDate = assessment.lastQuestionDate || now;
  correctedAnswer.setTimeSpentFrom({ now, lastQuestionDate });

  const answerSaved = await answerRepository.saveWithKnowledgeElements(correctedAnswer, []);
  answerSaved.levelup = {};

  if (userId) {
    await answerJobRepository.performAsync(new AnswerJob({ userId }));
  }

  return answerSaved;
}
