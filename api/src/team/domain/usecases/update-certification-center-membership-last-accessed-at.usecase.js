/**
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.certificationCenterId
 * @param {CertificationCenterMembershipRepository} params.certificationCenterMembershipRepository
 */
const updateCertificationCenterMembershipLastAccessedAt = async function ({
  userId,
  certificationCenterId,
  certificationCenterMembershipRepository,
}) {
  return certificationCenterMembershipRepository.updateLastAccessedAt({
    lastAccessedAt: new Date(),
    userId,
    certificationCenterId,
  });
};

export { updateCertificationCenterMembershipLastAccessedAt };
