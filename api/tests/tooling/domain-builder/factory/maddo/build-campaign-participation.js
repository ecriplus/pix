import { CampaignParticipation } from '../../../../../src/maddo/domain/models/CampaignParticipation.js';

export function buildCampaignParticipation({
  id,
  createdAt,
  participantExternalId,
  status,
  sharedAt,
  campaignId,
  userId,
  clientId,
  masteryRate,
  tubes,
} = {}) {
  return new CampaignParticipation({
    id,
    createdAt,
    participantExternalId,
    status,
    sharedAt,
    campaignId,
    userId,
    clientId,
    masteryRate,
    tubes,
  });
}
