import { ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME } from '../../../../db/migrations/20241118134739_create-organizations-profile-rewards-table.js';
import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';

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
