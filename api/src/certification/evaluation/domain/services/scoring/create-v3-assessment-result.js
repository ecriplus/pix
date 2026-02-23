import { AssessmentResultFactory } from '../../models/factories/AssessmentResultFactory.js';

export function createV3AssessmentResult({
  toBeCancelled,
  allAnswers,
  assessmentId,
  pixScore,
  status,
  competenceMarks,
  isRejectedForFraud,
  isAbortReasonTechnical,
  juryId,
  minimumAnswersRequiredToValidateACertification,
}) {
  if (toBeCancelled) {
    return AssessmentResultFactory.buildCancelledAssessmentResult({
      juryId,
      pixScore,
      assessmentId,
    });
  }
  if (isRejectedForFraud) {
    return AssessmentResultFactory.buildFraud({
      pixScore,
      assessmentId,
      juryId,
    });
  }

  if (
    _candidateDidNotAnswerEnoughV3CertificationQuestions(allAnswers, minimumAnswersRequiredToValidateACertification)
  ) {
    if (isAbortReasonTechnical) {
      return AssessmentResultFactory.buildLackOfAnswersForTechnicalReason({
        pixScore,
        assessmentId,
        juryId,
      });
    } else {
      return AssessmentResultFactory.buildLackOfAnswers({
        pixScore,
        status,
        assessmentId,
        juryId,
      });
    }
  }

  if (pixScore === 0) {
    return AssessmentResultFactory.buildRejectedDueToZeroPixScore({
      pixScore,
      assessmentId,
      juryId,
      competenceMarks,
    });
  }

  return AssessmentResultFactory.buildStandardAssessmentResult({
    pixScore,
    status,
    assessmentId,
    juryId,
  });
}

function _candidateDidNotAnswerEnoughV3CertificationQuestions(
  allAnswers,
  minimumAnswersRequiredToValidateACertification,
) {
  return allAnswers.length < minimumAnswersRequiredToValidateACertification;
}
