/**
 * Get the user's team information.
 *
 * @param {Object} params - The parameters.
 * @param {string} params.userId - The ID of the user.
 * @param {Object} params.adminMemberRepository - The repository for Pix Admin membership.
 * @param {Object} params.certificationCenterMembershipRepository - The repository for certification center memberships.
 * @param {Object} params.membershipRepository - The repository for organization memberships.
 * @returns {Promise<Object>} The user's team information.
 */
export const getUserTeamsInfo = async function ({
  userId,
  adminMemberRepository,
  certificationCenterMembershipRepository,
  membershipRepository,
}) {
  const pixAdminMembership = await adminMemberRepository.get({ userId });
  const organizationMembershipsCount = await membershipRepository.countByUserId(userId);
  const certificationCenterMembershipsCount = await certificationCenterMembershipRepository.countByUserId(userId);

  return {
    isPixAgent: pixAdminMembership?.hasAccessToAdminScope ?? false,
    isOrganizationMember: organizationMembershipsCount > 0,
    isCertificationCenterMember: certificationCenterMembershipsCount > 0,
  };
};
