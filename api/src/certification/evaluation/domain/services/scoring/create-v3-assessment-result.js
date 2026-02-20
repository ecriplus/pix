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
      reproducibilityRate: 100,
      assessmentId,
    });
  }
  if (isRejectedForFraud) {
    return AssessmentResultFactory.buildFraud({
      pixScore,
      reproducibilityRate: 100,
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
        reproducibilityRate: 100,
        assessmentId,
        juryId,
      });
    } else {
      return AssessmentResultFactory.buildLackOfAnswers({
        pixScore,
        reproducibilityRate: 100,
        status,
        assessmentId,
        juryId,
      });
    }
  }

  if (pixScore === 0) {
    return AssessmentResultFactory.buildRejectedDueToZeroPixScore({
      pixScore,
      reproducibilityRate: 100,
      assessmentId,
      juryId,
      competenceMarks,
    });
  }

  return AssessmentResultFactory.buildStandardAssessmentResult({
    pixScore,
    reproducibilityRate: 100,
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
