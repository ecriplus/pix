import { knex } from '../../../../db/knex-database-connection.js';
import { CampaignParticipation } from '../../domain/models/CampaignParticipation.js';

export async function findByCampaignId(campaignId, clientId) {
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
    )
    .from('campaign-participations')
    .where('campaignId', campaignId)
    .orderBy('id');
  return rawCampaigns.map((rawCampaign) => toDomain(rawCampaign, clientId));
}

function toDomain(rawCampaignParticipation, clientId) {
  return new CampaignParticipation({ ...rawCampaignParticipation, clientId });
}
