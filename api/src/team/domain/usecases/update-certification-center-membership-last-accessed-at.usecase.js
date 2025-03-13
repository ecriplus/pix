import { ForbiddenError } from '../../../shared/application/http-errors.js';

/**
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.certificationCenterMembershipId
 * @param {CertificationCenterMembershipRepository} params.certificationCenterMembershipRepository
 */
const updateCertificationCenterMembershipLastAccessedAt = async function ({
  userId,
  certificationCenterMembershipId,
  certificationCenterMembershipRepository,
}) {
  const certificationCenterMembership = await certificationCenterMembershipRepository.findById(
    certificationCenterMembershipId,
  );
  if (certificationCenterMembership.user.id !== userId || certificationCenterMembership.disabledAt) {
    throw new ForbiddenError();
  }

  return certificationCenterMembershipRepository.updateLastAccessedAt({
    lastAccessedAt: new Date(),
    userId,
    certificationCenterMembershipId,
  });
};

export { updateCertificationCenterMembershipLastAccessedAt };
