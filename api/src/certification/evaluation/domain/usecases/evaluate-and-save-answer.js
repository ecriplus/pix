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
  certificationChallengeLiveAlertRepository,
  sharedChallengeRepository,
}) {
  const assessmentSheet = await assessmentSheetRepository.findByCertificationCourseId(certificationCourseId);
  if (!assessmentSheet) {
    throw new NotFoundError(`No certification test found with id ${certificationCourseId}`);
  }
  checkIfAnswerIsAdmissible({ assessmentSheet, answer, userId });

  const challenge = await sharedChallengeRepository.get(answer.challengeId);
  const ongoingOrValidatedCertificationChallengeLiveAlert =
    await certificationChallengeLiveAlertRepository.getOngoingOrValidatedByChallengeIdAndAssessmentId({
      challengeId: challenge.id,
      assessmentId: assessmentSheet.assessmentId,
    });

  if (ongoingOrValidatedCertificationChallengeLiveAlert) {
    throw new ForbiddenAccess('An alert has been set.');
  }

  return 'coucou';
}

function checkIfAnswerIsAdmissible({ assessmentSheet, answer, userId }) {
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
}
