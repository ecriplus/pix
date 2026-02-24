import { AssessmentResultFactory } from '../../models/factories/AssessmentResultFactory.js';

export function createV3AssessmentResult({
  toBeCancelled,
  allAnswers,
  assessmentId,
  pixScore,
  capacity,
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
      capacity,
    });
  }
  if (isRejectedForFraud) {
    return AssessmentResultFactory.buildFraud({
      pixScore,
      assessmentId,
      juryId,
      competenceMarks,
      capacity,
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
        capacity,
      });
    } else {
      return AssessmentResultFactory.buildLackOfAnswers({
        pixScore,
        status,
        assessmentId,
        juryId,
        competenceMarks,
        capacity,
      });
    }
  }

  if (pixScore === 0) {
    return AssessmentResultFactory.buildRejectedDueToZeroPixScore({
      pixScore,
      assessmentId,
      juryId,
      competenceMarks,
      capacity,
    });
  }

  return AssessmentResultFactory.buildStandardAssessmentResult({
    pixScore,
    status,
    assessmentId,
    juryId,
    competenceMarks,
    capacity,
  });
}

function _candidateDidNotAnswerEnoughV3CertificationQuestions(
  allAnswers,
  minimumAnswersRequiredToValidateACertification,
) {
  return allAnswers.length < minimumAnswersRequiredToValidateACertification;
}
