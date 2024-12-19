class CampaignParticipationKnowledgeElementSnapshots {
  constructor({ userId, snappedAt, knowledgeElements, campaignParticipationId } = {}) {
    this.userId = userId;
    this.snappedAt = snappedAt;
    this.knowledgeElements = knowledgeElements;
    this.campaignParticipationId = campaignParticipationId;
  }
}

export { CampaignParticipationKnowledgeElementSnapshots };
