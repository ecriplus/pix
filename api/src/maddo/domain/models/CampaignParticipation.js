import assert from 'node:assert';
import crypto from 'node:crypto';

class CampaignParticipation {
  constructor({ id, createdAt, participantExternalId, status, sharedAt, campaignId, userId, clientId } = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.status = status;
    this.participantExternalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.campaignId = campaignId;
    assert.ok(clientId, 'Client ID should be defined');
    this.learnerId = crypto.hash('sha1', `${userId}_${clientId}`);
    this.status = status;
  }
}

export { CampaignParticipation };
