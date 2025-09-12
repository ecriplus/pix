import { CertificationRejectNotAllowedError } from '../../../../shared/domain/errors.js';
import { AlgorithmEngineVersion } from '../../../shared/domain/models/AlgorithmEngineVersion.js';
import { CertificationCourseRejected } from '../events/CertificationCourseRejected.js';

export const rejectCertificationCourse = async ({
  certificationCourseId,
  juryId,
  certificationCourseRepository,
  certificationRescoringRepository,
  courseAssessmentResultRepository,
}) => {
  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });

  try {
    const latestAssessmentResult = await courseAssessmentResultRepository.getLatestAssessmentResult({
      certificationCourseId,
    });
    if (latestAssessmentResult && latestAssessmentResult.status === 'cancelled') {
      throw new CertificationRejectNotAllowedError();
    }
  } catch (error) {
    if (error.message !== 'No assessment result found') {
      throw error;
    }
  }

  certificationCourse.rejectForFraud();
  await certificationCourseRepository.update({ certificationCourse });

  const event = new CertificationCourseRejected({ certificationCourseId, juryId });

  if (AlgorithmEngineVersion.isV3(certificationCourse.getVersion())) {
    return certificationRescoringRepository.rescoreV3Certification({ event });
  }

  if (AlgorithmEngineVersion.isV2(certificationCourse.getVersion())) {
    return certificationRescoringRepository.rescoreV2Certification({ event });
  }
};
