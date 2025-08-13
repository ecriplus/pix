import { Examiner } from '../../../shared/domain/models/Examiner.js';
import { AnswerEvaluationError } from '../errors.js';
import { ValidatorAlwaysOK } from '../models/ValidatorAlwaysOK.js';

export function evaluateAnswer({
  challenge,
  answer,
  assessment,
  accessibilityAdjustmentNeeded,
  forceOKAnswer = false,
}) {
  let examiner;
  if (forceOKAnswer) {
    const validatorAlwaysOK = new ValidatorAlwaysOK();
    examiner = new Examiner({ validator: validatorAlwaysOK });
  } else {
    examiner = new Examiner({ validator: challenge.validator });
  }

  try {
    return examiner.evaluate({
      answer,
      challengeFormat: challenge.format,
      isFocusedChallenge: challenge.focused,
      hasLastQuestionBeenFocusedOut: assessment.hasLastQuestionBeenFocusedOut,
      isCertificationEvaluation: assessment.isCertification(),
      accessibilityAdjustmentNeeded,
    });
  } catch {
    throw new AnswerEvaluationError(challenge);
  }
}
