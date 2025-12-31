/**
 * @typedef {import ('../../domain/usecases/index.js').CertificateRepository} CertificateRepository
 */

/**
 * @param {object} params
 * @param {CertificateRepository} params.certificateRepository
 */
export const getCertificate = async function ({ certificationCourseId, locale, certificateRepository }) {
  return certificateRepository.getCertificate({ certificationCourseId, locale });
};
