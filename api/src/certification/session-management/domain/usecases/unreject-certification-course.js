import { CertificationCourseUnrejected } from '../../../../shared/domain/events/CertificationCourseUnrejected.js';
import { AlgorithmEngineVersion } from '../../../shared/domain/models/AlgorithmEngineVersion.js';

export const unrejectCertificationCourse = async ({
  certificationCourseId,
  juryId,
  certificationCourseRepository,
  certificationRescoringRepository,
}) => {
  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });
  certificationCourse.unrejectForFraud();
  await certificationCourseRepository.update({ certificationCourse });

  const event = new CertificationCourseUnrejected({ certificationCourseId, juryId });

  if (AlgorithmEngineVersion.isV3(certificationCourse.getVersion())) {
    return certificationRescoringRepository.rescoreV3Certification({ event });
  }

  if (AlgorithmEngineVersion.isV2(certificationCourse.getVersion())) {
    return certificationRescoringRepository.rescoreV2Certification({ event });
  }
};
