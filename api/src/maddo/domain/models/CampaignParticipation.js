import assert from 'node:assert';
import crypto from 'node:crypto';

class CampaignParticipation {
  constructor({
    id,
    participantExternalId,
    status,
    createdAt,
    sharedAt,
    campaignId,
    userId,
    clientId,
    masteryRate,
    tubes,
  } = {}) {
    this.id = id;
    this.status = status;
    this.participantExternalId = participantExternalId;
    this.createdAt = createdAt;
    this.sharedAt = sharedAt;
    this.campaignId = campaignId;
    assert.ok(clientId, 'Client ID should be defined');
    assert.ok(userId, 'User ID should be defined');
    this.learnerId = crypto.hash('sha1', `${userId}_${clientId}`);
    this.status = status;
    this.masteryRate = masteryRate;
    this.tubes = tubes;
  }
}

export { CampaignParticipation };
