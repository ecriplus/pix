import { knex } from '../../../../db/knex-database-connection.js';
import { CampaignParticipation } from '../../domain/models/CampaignParticipation.js';

export async function findByCampaignId(campaignId) {
  const rawCampaigns = await knex
    .select(
      'id',
      'createdAt',
      'participantExternalId',
      'status',
      'sharedAt',
      'deletedAt',
      'deletedBy',
      'campaignId',
      'userId',
      'organizationLearnerId',
    )
    .from('campaign-participations')
    .where('campaignId', campaignId)
    .orderBy('id');
  return rawCampaigns.map(toDomain);
}

function toDomain(rawCampaignParticipation) {
  return new CampaignParticipation(rawCampaignParticipation);
}
