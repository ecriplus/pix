import { ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME } from '../../../../db/migrations/20241118134739_create-organizations-profile-rewards-table.js';
import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { OrganizationProfileReward } from '../../domain/models/OrganizationProfileReward.js';

export const save = async ({ organizationId, profileRewardId }) => {
  const knexConn = DomainTransaction.getConnection();
  await knexConn(ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME)
    .insert({
      organizationId,
      profileRewardId,
    })
    .onConflict()
    .ignore();
};

export const getByOrganizationId = async ({ organizationId }) => {
  const knexConn = DomainTransaction.getConnection();
  const organizationProfileRewards = await knexConn(ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME).where({ organizationId });
  return organizationProfileRewards.map(
    (organizationProfileReward) => new OrganizationProfileReward(organizationProfileReward),
  );
};
