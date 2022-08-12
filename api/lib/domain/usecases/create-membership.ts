// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'roles'.
const { roles } = require('../models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationArchivedError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createMembership({
  userId,
  organizationId,
  membershipRepository,
  organizationRepository
}: $TSFixMe) {
  const organization = await organizationRepository.get(organizationId);

  if (organization.archivedAt) {
    throw new OrganizationArchivedError();
  }

  const memberships = await membershipRepository.findByOrganizationId({ organizationId });
  const organizationRole = memberships.length ? roles.MEMBER : roles.ADMIN;

  return membershipRepository.create(userId, organizationId, organizationRole);
};
