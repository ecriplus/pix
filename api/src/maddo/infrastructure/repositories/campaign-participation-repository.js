import * as campaignsAPI from '../../../prescription/campaign/application/api/campaigns-api.js';
import { CampaignParticipation } from '../../domain/models/CampaignParticipation.js';
import { TubeCoverage } from '../../domain/models/TubeCoverage.js';

export async function findByCampaignId(campaignId, clientId, page, since) {
  const { models: campaignParticipations, meta } = await campaignsAPI.getCampaignParticipations({
    campaignId,
    page,
    since,
  });
  return { models: campaignParticipations.map((rawCampaign) => toDomain(rawCampaign, clientId, campaignId)), meta };
}

function toDomain(rawCampaignParticipation, clientId, campaignId) {
  return new CampaignParticipation({
    id: rawCampaignParticipation.campaignParticipationId,
    status: rawCampaignParticipation.status,
    participantExternalId: rawCampaignParticipation.participantExternalId,
    createdAt: rawCampaignParticipation.createdAt,
    sharedAt: rawCampaignParticipation.sharedAt,
    userId: rawCampaignParticipation.userId,
    masteryRate: rawCampaignParticipation.masteryRate,
    tubes: rawCampaignParticipation.tubes?.map((tube) => new TubeCoverage(tube)),
    pixScore: rawCampaignParticipation.pixScore,
    clientId,
    campaignId,
  });
}
