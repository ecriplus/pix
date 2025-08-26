import assert from 'node:assert';
import crypto from 'node:crypto';

class CampaignParticipation {
  constructor({
    id,
    participantFirstName,
    participantLastName,
    participantExternalId,
    status,
    createdAt,
    sharedAt,
    campaignId,
    userId,
    clientId,
    masteryRate,
    tubes,
    pixScore,
  } = {}) {
    this.id = id;
    this.status = status;
    this.participantFirstName = participantFirstName;
    this.participantLastName = participantLastName;
    this.participantExternalId = participantExternalId;
    this.createdAt = createdAt;
    this.sharedAt = sharedAt;
    this.campaignId = campaignId;
    assert.ok(clientId, 'Client ID should be defined');
    assert.ok(userId, 'User ID should be defined');
    this.participantId = crypto.hash('sha1', `${userId}_${clientId}`);
    this.masteryRate = masteryRate;
    this.tubes = tubes;
    this.pixScore = pixScore;
  }
}

export { CampaignParticipation };
