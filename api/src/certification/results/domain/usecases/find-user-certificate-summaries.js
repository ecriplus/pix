/**
 * @typedef {import ('../../domain/usecases/index.js').CertificateSummaryRepository} CertificateSummaryRepository
 */

/**
 * @param {object} params
 * @param {number} params.userId
 * @param {CertificateSummaryRepository} params.certificateSummaryRepository
 */
const findUserCertificateSummaries = function ({ userId, certificateSummaryRepository }) {
  return certificateSummaryRepository.findByUserId({ userId });
};

export { findUserCertificateSummaries };
