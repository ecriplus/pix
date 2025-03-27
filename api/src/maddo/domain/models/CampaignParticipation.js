class CampaignParticipation {
  constructor({
    id,
    createdAt,
    participantExternalId,
    status,
    sharedAt,
    deletedAt,
    deletedBy,
    campaignId,
    userId,
    organizationLearnerId,
  } = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.status = status;
    this.participantExternalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.campaignId = campaignId;
    this.userId = userId;
    this.status = status;
    this.organizationLearnerId = organizationLearnerId;
  }
}

export { CampaignParticipation };
