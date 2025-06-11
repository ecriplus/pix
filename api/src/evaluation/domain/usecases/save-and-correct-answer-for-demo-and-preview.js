import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { ChallengeAlreadyAnsweredError, ChallengeNotAskedError } from '../../../shared/domain/errors.js';
import { EmptyAnswerError } from '../errors.js';

const saveAndCorrectAnswerForDemoAndPreview = withTransaction(async function ({
  answer,
  assessment,
  forceOKAnswer = false,
  answerRepository,
  challengeRepository,
  correctionService,
} = {}) {
  if (assessment.answers.some((existingAnswer) => existingAnswer.challengeId === answer.challengeId)) {
    throw new ChallengeAlreadyAnsweredError();
  }
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
  const now = new Date();
  const lastQuestionDate = assessment.lastQuestionDate || now;
  correctedAnswer.setTimeSpentFrom({ now, lastQuestionDate });

  const answerSaved = await answerRepository.save({ answer: correctedAnswer });
  answerSaved.levelup = {};
  return answerSaved;
});

export { saveAndCorrectAnswerForDemoAndPreview };
