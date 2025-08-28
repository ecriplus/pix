import { CampaignParticipation } from '../../../../../src/maddo/domain/models/CampaignParticipation.js';

export function buildCampaignParticipation({
  id,
  createdAt,
  participantFirstName,
  participantLastName,
  participantExternalId,
  status,
  sharedAt,
  campaignId,
  userId,
  clientId,
  masteryRate,
  tubes,
  pixScore,
} = {}) {
  return new CampaignParticipation({
    id,
    createdAt,
    participantFirstName,
    participantLastName,
    participantExternalId,
    status,
    sharedAt,
    campaignId,
    userId,
    clientId,
    masteryRate,
    tubes,
    pixScore,
  });
}
