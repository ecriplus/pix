import _ from 'lodash';

import { ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME } from '../../migrations/20241118134739_create-organizations-profile-rewards-table.js';
import { databaseBuffer } from '../database-buffer.js';
import { buildOrganization } from './build-organization.js';
import { buildProfileReward } from './build-profile-reward.js';

export const buildOrganizationProfileReward = ({
  id = databaseBuffer.getNextId(),
  organizationId,
  profileRewardId,
} = {}) => {
  organizationId = _.isUndefined(organizationId) ? buildOrganization().id : organizationId;
  profileRewardId = _.isUndefined(profileRewardId) ? buildProfileReward().id : profileRewardId;

  const values = {
    id,
    organizationId,
    profileRewardId,
  };

  return databaseBuffer.pushInsertable({
    tableName: ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME,
    values,
  });
};
