/**
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.organizationId
 * @param {MembershipRepository} params.membershipRepository
 */
const updateMembershipLastAccessedAt = async function ({ userId, organizationId, membershipRepository }) {
  return membershipRepository.updateLastAccessedAt({
    userId,
    organizationId,
    lastAccessedAt: new Date(),
  });
};

export { updateMembershipLastAccessedAt };
