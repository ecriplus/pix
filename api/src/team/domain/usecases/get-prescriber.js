import _ from 'lodash';

import { UserHasNoOrganizationMembershipError } from '../errors.js';

/**
 * @param {{
 * userId: string,
 * prescriberRepository: PrescriberRepository,
 * sharedMembershipRepository: sharedMembershipRepository,
 * userOrgaSettingsRepository: UserOrgaSettingsRepository
 * }} params
 * @return {Promise<Prescriber>}
 * @throws {UserHasNoOrganizationMembershipError}
 */
export const getPrescriber = async function ({
  userId,
  prescriberRepository,
  sharedMembershipRepository,
  userOrgaSettingsRepository,
}) {
  const memberships = await sharedMembershipRepository.findByUserId({ userId });
  if (_.isEmpty(memberships)) {
    throw new UserHasNoOrganizationMembershipError();
  }

  const userOrgaSettings = await userOrgaSettingsRepository.findOneByUserId(userId);
  const firstOrganization = memberships[0].organization;

  if (_.isEmpty(userOrgaSettings)) {
    await userOrgaSettingsRepository.create(userId, firstOrganization.id);
  } else if (!_isCurrentOrganizationInMemberships(userOrgaSettings, memberships)) {
    await userOrgaSettingsRepository.update(userId, firstOrganization.id);
  }
  return prescriberRepository.getPrescriber({ userId });
};

function _isCurrentOrganizationInMemberships(userOrgaSettings, memberships) {
  const currentOrganizationId = userOrgaSettings.currentOrganization.id;
  return _.find(memberships, { organization: { id: currentOrganizationId } });
}
