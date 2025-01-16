import { Campaign } from './Campaign.js';

class CampaignManagement extends Campaign {
  constructor({
    creatorLastName,
    creatorFirstName,
    organizationName,
    targetProfileName,
    ownerLastName,
    ownerFirstName,
    ownerId,
    shared,
    started,
    completed,
    ...campaignAttributes
  } = {}) {
    super(campaignAttributes);
    this.creatorLastName = creatorLastName;
    this.creatorFirstName = creatorFirstName;
    this.organizationName = organizationName;
    this.targetProfileName = targetProfileName;
    this.ownerLastName = ownerLastName;
    this.ownerFirstName = ownerFirstName;
    this.ownerId = ownerId;
    this.sharedParticipationsCount = shared;
    this.totalParticipationsCount = this.#computeTotalParticipation(this.sharedParticipationsCount, started, completed);
    this.hasParticipation = this.totalParticipationsCount > 0;
  }

  #computeTotalParticipation(sharedParticipationsCount, started, completed) {
    return sharedParticipationsCount + (started || 0) + completed;
  }
}

export { CampaignManagement };
