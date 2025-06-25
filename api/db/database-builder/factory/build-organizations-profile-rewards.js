import { ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME } from '../../migrations/20241118134739_create-organizations-profile-rewards-table.js';
import { databaseBuffer } from '../database-buffer.js';
import { buildOrganization } from './build-organization.js';
import { buildProfileReward } from './build-profile-reward.js';

const buildOrganizationsProfileRewards = function ({
  id = databaseBuffer.getNextId(),
  profileRewardId,
  organizationId,
} = {}) {
  if (profileRewardId === undefined) profileRewardId = buildProfileReward().id;
  if (organizationId === undefined) organizationId = buildOrganization().id;

  const values = {
    id,
    profileRewardId,
    organizationId,
  };

  return databaseBuffer.pushInsertable({
    tableName: ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME,
    values,
  });
};

export { buildOrganizationsProfileRewards };
