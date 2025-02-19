import { ChallengeNotAskedError } from '../../../shared/domain/errors.js';
import { EmptyAnswerError } from '../errors.js';

export async function saveAndCorrectAnswerForDemoAndPreview({
  answer,
  assessment,
  forceOKAnswer = false,
  answerRepository,
  challengeRepository,
  correctionService,
  dateUtils,
} = {}) {
  if (assessment.lastChallengeId && assessment.lastChallengeId !== answer.challengeId) {
    throw new ChallengeNotAskedError();
  }
  if (!answer.hasValue && !answer.hasTimedOut) {
    throw new EmptyAnswerError();
  }

  const challenge = await challengeRepository.get(answer.challengeId);
  const correctedAnswer = correctionService.evaluateAnswer({
    challenge,
    answer,
    assessment,
    accessibilityAdjustmentNeeded: false,
    forceOKAnswer,
  });
  const now = dateUtils.getNowDate();
  const lastQuestionDate = assessment.lastQuestionDate || now;
  correctedAnswer.setTimeSpentFrom({ now, lastQuestionDate });

  const answerSaved = await answerRepository.saveWithKnowledgeElements(correctedAnswer, []);
  answerSaved.levelup = {};
  return answerSaved;
}
