import { CertificationCompletedJob } from '../../../certification/evaluation/domain/events/CertificationCompleted.js';
import { AlreadyRatedAssessmentError } from '../errors.js';

const completeAssessment = async function ({
  assessmentId,
  assessmentRepository,
  certificationCompletedJobRepository,
  locale,
}) {
  const assessment = await assessmentRepository.get(assessmentId);

  if (assessment.isCompleted()) {
    throw new AlreadyRatedAssessmentError();
  }

  await assessmentRepository.completeByAssessmentId(assessmentId);

  if (assessment.certificationCourseId) {
    await certificationCompletedJobRepository.performAsync(
      new CertificationCompletedJob({
        assessmentId: assessment.id,
        userId: assessment.userId,
        certificationCourseId: assessment.certificationCourseId,
        locale,
      }),
    );
  }

  return assessment;
};

export { completeAssessment };
