class CampaignParticipationForUserManagement {
  constructor({
    id,
    campaignParticipationId,
    participantExternalId,
    status,
    campaignId,
    campaignCode,
    createdAt,
    sharedAt,
    updatedAt,
    deletedAt,
    organizationLearnerFirstName,
    organizationLearnerLastName,
  } = {}) {
    this.id = id;
    this.campaignParticipationId = campaignParticipationId;
    this.createdAt = createdAt;
    this.participantExternalId = null;
    this.status = null;
    this.campaignId = null;
    this.campaignCode = null;
    this.sharedAt = null;
    this.deletedAt = null;

    if (campaignParticipationId) {
      this.organizationLearnerFullName = `${organizationLearnerFirstName} ${organizationLearnerLastName}`;
      this.participantExternalId = participantExternalId;
      this.status = status;
      this.campaignId = campaignId;
      this.campaignCode = campaignCode;
      this.sharedAt = sharedAt;
      this.deletedAt = deletedAt;
    } else {
      this.organizationLearnerFullName = '-';
      this.deletedAt = updatedAt;
    }
  }
}

export { CampaignParticipationForUserManagement };
