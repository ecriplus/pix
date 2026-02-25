import { AssessmentResultFactory } from '../../models/factories/AssessmentResultFactory.js';

export function createV3AssessmentResult({
  toBeCancelled,
  allAnswers,
  assessmentId,
  pixScore,
  capacity,
  versionId,
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
      versionId,
    });
  }
  if (isRejectedForFraud) {
    return AssessmentResultFactory.buildFraud({
      pixScore,
      assessmentId,
      juryId,
      competenceMarks,
      capacity,
      versionId,
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
        versionId,
      });
    } else {
      return AssessmentResultFactory.buildLackOfAnswers({
        pixScore,
        status,
        assessmentId,
        juryId,
        competenceMarks,
        capacity,
        versionId,
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
      versionId,
    });
  }

  return AssessmentResultFactory.buildStandardAssessmentResult({
    pixScore,
    status,
    assessmentId,
    juryId,
    competenceMarks,
    capacity,
    versionId,
  });
}

function _candidateDidNotAnswerEnoughV3CertificationQuestions(
  allAnswers,
  minimumAnswersRequiredToValidateACertification,
) {
  return allAnswers.length < minimumAnswersRequiredToValidateACertification;
}
