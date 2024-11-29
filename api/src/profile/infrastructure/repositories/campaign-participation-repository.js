import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { Campaign } from '../../domain/models/Campaign.js';

export async function getCampaignByParticipationId({ campaignParticipationId }) {
  const knexConnection = DomainTransaction.getConnection();
  const campaign = await knexConnection('campaign-participations')
    .select('campaigns.id', 'campaigns.organizationId', 'campaigns.targetProfileId')
    .innerJoin('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
    .where({ 'campaign-participations.id': campaignParticipationId })
    .first();

  return campaign ? new Campaign(campaign) : null;
}
