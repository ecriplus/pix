/**
 * @typedef {import ('../../domain/usecases/index.js').CertificateRepository} CertificateRepository
 * @typedef {import ('../../domain/usecases/index.js').CertificationCourseRepository} CertificationCourseRepository
 */

/**
 * @param {Object} params
 * @param {CertificateRepository} params.certificateRepository
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 */
export const getCertificate = async function ({ certificationCourseId, locale, certificateRepository }) {
  return certificateRepository.getCertificate({ certificationCourseId, locale });
};
