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
  });
}
