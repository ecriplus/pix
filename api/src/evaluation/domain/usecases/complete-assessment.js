import { AlreadyRatedAssessmentError } from '../errors.js';

const completeAssessment = async function ({
  assessmentId,
  assessmentRepository,
  certificationEvaluationRepository,
  locale,
}) {
  const assessment = await assessmentRepository.get(assessmentId);
  if (assessment.isCertification()) {
    await certificationEvaluationRepository.completeCertificationTest({
      certificationCourseId: assessment.certificationCourseId,
      locale,
    });
    return await assessmentRepository.get(assessmentId);
  }

  if (assessment.isCompleted()) {
    throw new AlreadyRatedAssessmentError();
  }

  await assessmentRepository.completeByAssessmentId(assessmentId);
  return assessment;
};

export { completeAssessment };
