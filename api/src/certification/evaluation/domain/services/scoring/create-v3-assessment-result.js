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
      competenceMarks,
    });
  }
  if (isRejectedForFraud) {
    return AssessmentResultFactory.buildFraud({
      pixScore,
      assessmentId,
      juryId,
      competenceMarks,
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
        competenceMarks,
      });
    } else {
      return AssessmentResultFactory.buildLackOfAnswers({
        pixScore,
        status,
        assessmentId,
        juryId,
        competenceMarks,
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
    competenceMarks,
  });
}

function _candidateDidNotAnswerEnoughV3CertificationQuestions(
  allAnswers,
  minimumAnswersRequiredToValidateACertification,
) {
  return allAnswers.length < minimumAnswersRequiredToValidateACertification;
}
