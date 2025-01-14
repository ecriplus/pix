/**
 * @typedef {import('../../domain/usecases/index.js').CertificationRepository} CertificationRepository
 */

/**
 * @param {Object} params
 * @param {string} params.ine
 * @param {string} params.organizationUai
 * @param {string} params.lastName
 * @param {string} params.firstName
 * @param {string} params.birthdate - Format YYYY-MM-DD
 * @param {string} params.verificationCode
 * @param {CertificationRepository} params.certificationRepository
 **/
export const getCertificationResult = function ({
  ine,
  organizationUai,
  lastName,
  firstName,
  birthdate,
  verificationCode,
  certificationRepository,
}) {
  if (ine) {
    return certificationRepository.getByINE({ ine });
  }

  if (organizationUai) {
    return certificationRepository.getByOrganizationUAI({ organizationUai, lastName, firstName, birthdate });
  }

  if (verificationCode) {
    return certificationRepository.getByVerificationCode({ verificationCode });
  }
};
