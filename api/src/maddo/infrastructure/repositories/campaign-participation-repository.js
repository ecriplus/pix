import * as campaignAPI from '../../../prescription/campaign/application/api/campaigns-api.js';
import { CampaignParticipation } from '../../domain/models/CampaignParticipation.js';

export async function findByCampaignId(campaignId, clientId) {
  const campaignParticipations = await campaignAPI.getCampaignParticipations({ campaignId });
  return campaignParticipations.map((rawCampaign) => toDomain(rawCampaign, clientId, campaignId));
}

function toDomain(rawCampaignParticipation, clientId, campaignId) {
  return new CampaignParticipation({
    id: rawCampaignParticipation.campaignParticipationId,
    status: rawCampaignParticipation.status,
    participantExternalId: rawCampaignParticipation.participantExternalId,
    createdAt: rawCampaignParticipation.createdAt,
    sharedAt: rawCampaignParticipation.sharedAt,
    userId: rawCampaignParticipation.userId,
    clientId,
    campaignId,
  });
}
