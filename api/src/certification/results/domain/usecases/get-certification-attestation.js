/**
 * @typedef {import ('../../domain/usecases/index.js').CertificateRepository} CertificateRepository
 * @typedef {import ('../../domain/usecases/index.js').CertificationCourseRepository} CertificationCourseRepository
 */
import { UnauthorizedError } from '../../../../shared/application/http-errors.js';

/**
 * @param {Object} params
 * @param {CertificateRepository} params.certificateRepository
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 */
export const getCertificationAttestation = async function ({
  userId,
  certificationCourseId,
  certificateRepository,
  certificationCourseRepository,
}) {
  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });

  if (certificationCourse.getUserId() !== userId) {
    throw new UnauthorizedError();
  }

  return certificateRepository.getCertificationAttestation({ certificationCourseId });
};
