import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { UserCampaignParticipation } from '../../domain/read-models/UserCampaignParticipation.js';

const findByUserId = async function ({ userId }) {
  const knexConn = DomainTransaction.getConnection();
  const rows = await knexConn('campaign-participations')
    .select({
      id: 'campaign-participations.id',
      campaignId: 'campaigns.id',
      targetProfileId: 'campaigns.targetProfileId',
    })
    .join('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
    .where({ 'campaign-participations.userId': userId })
    .whereNull('campaign-participations.deletedAt');
  return rows.map((row) => new UserCampaignParticipation(row));
};

export { findByUserId };
