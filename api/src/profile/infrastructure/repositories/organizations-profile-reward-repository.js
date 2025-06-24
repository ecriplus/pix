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

export const remove = async ({ organizationId, profileRewardId }) => {
  const knexConn = DomainTransaction.getConnection();
  await knexConn(ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME)
    .update({ profileRewardId: null })
    .where({ organizationId, profileRewardId });
};

export const getByOrganizationId = async ({ attestationKey, organizationId }) => {
  const knexConn = DomainTransaction.getConnection();
  const query = knexConn('organizations-profile-rewards')
    .join('profile-rewards', 'organizations-profile-rewards.profileRewardId', '=', 'profile-rewards.id')
    .where({ organizationId });

  if (attestationKey !== undefined) {
    query.join('attestations', 'profile-rewards.rewardId', '=', 'attestations.id').where({ key: attestationKey });
  }

  const organizationProfileRewards = await query;
  return organizationProfileRewards.map(
    (organizationProfileReward) => new OrganizationProfileReward(organizationProfileReward),
  );
};
