/**
 * @typedef {import('../../infrastructure/repositories/certification-center-for-admin.repository.js')} CertificationCenterRepositoryForAdmin
 */

/**
 * @param {Object} params
 * @param {CertificationCenterRepositoryForAdmin} params.certificationCenterForAdminRepository
 * @param {number} params.organizationId
 * @returns {Promise<AttachedCertificationCenter[]>}
 */
const findAttachedCertificationCenterForAdmin = async function ({
  organizationId,
  certificationCenterForAdminRepository,
}) {
  return certificationCenterForAdminRepository.findAttachedByOrganizationId(organizationId);
};

export { findAttachedCertificationCenterForAdmin };
