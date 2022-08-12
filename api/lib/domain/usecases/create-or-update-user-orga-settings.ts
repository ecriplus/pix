// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotMem... Remove this comment to see the full error message
const { UserNotMemberOfOrganizationError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createOrUpdateUserOrgaSettings({
  userId,
  organizationId,
  userOrgaSettingsRepository,
  membershipRepository
}: $TSFixMe) {
  const memberships = await membershipRepository.findByUserIdAndOrganizationId({ userId, organizationId });

  if (_.isEmpty(memberships)) {
    throw new UserNotMemberOfOrganizationError(
      `L'utilisateur ${userId} n'est pas membre de l'organisation ${organizationId}.`
    );
  }

  return userOrgaSettingsRepository.createOrUpdate({ userId, organizationId });
};
