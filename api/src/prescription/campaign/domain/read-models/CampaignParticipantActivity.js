class CampaignParticipantActivity {
  constructor({
    organizationLearnerId,
    campaignParticipationId,
    firstName,
    lastName,
    participantExternalId,
    status,
    participationCount,
  } = {}) {
    this.organizationLearnerId = organizationLearnerId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.participantExternalId = participantExternalId;
    this.status = status === status;
    this.lastCampaignParticipationId = campaignParticipationId;
    this.participationCount = participationCount || 0;
  }
}

export { CampaignParticipantActivity };
