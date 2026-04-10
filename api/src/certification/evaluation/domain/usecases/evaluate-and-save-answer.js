import { EmptyAnswerError } from '../../../../evaluation/domain/errors.js';
import {
  CertificationEndedByFinalizationError,
  CertificationEndedByInvigilatorError,
  ChallengeAlreadyAnsweredError,
  ChallengeNotAskedError,
  ForbiddenAccess,
  NotFoundError,
} from '../../../../shared/domain/errors.js';

export async function evaluateAndSaveAnswer({
  answer,
  userId,
  certificationCourseId,
  forceOKAnswer,
  assessmentSheetRepository,
}) {
  const assessmentSheet = await assessmentSheetRepository.findByCertificationCourseId(certificationCourseId);
  if (!assessmentSheet) {
    throw new NotFoundError(`No certification test found with id ${certificationCourseId}`);
  }
  if (assessmentSheet.userId !== userId) {
    throw new ForbiddenAccess('User is not allowed to add an answer for this certification test.');
  }
  if (assessmentSheet.isEndedByInvigilator()) {
    throw new CertificationEndedByInvigilatorError();
  }
  if (assessmentSheet.hasBeenEndedDueToFinalization()) {
    throw new CertificationEndedByFinalizationError();
  }
  if (!assessmentSheet.isChallengeExpectedToBeAnsweredNext(answer.challengeId)) {
    throw new ChallengeNotAskedError();
  }
  if (assessmentSheet.hasAnsweredChallenge(answer.challengeId)) {
    throw new ChallengeAlreadyAnsweredError();
  }
  if (!answer.hasValue && !answer.hasTimedOut) {
    throw new EmptyAnswerError();
  }

  return 'coucou';
}
