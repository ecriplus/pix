import { UnauthorizedError } from '../../../../shared/application/http-errors.js';

const getCertificationAttestation = async function ({
  userId,
  certificationCourseId,
  certificateRepository,
  certificationCourseRepository,
}) {
  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });

  if (certificationCourse.getUserId() !== userId) {
    throw new UnauthorizedError();
  }

  return certificateRepository.getCertificationAttestation({
    certificationCourseId,
  });
};

export { getCertificationAttestation };
