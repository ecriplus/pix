import { CampaignParticipationStatuses } from '../../../shared/domain/constants.js';

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
    // TODO Remove TO_SHARE status once it's no longer used
    this.status = status === CampaignParticipationStatuses.TO_SHARE ? CampaignParticipationStatuses.STARTED : status;
    this.lastCampaignParticipationId = campaignParticipationId;
    this.participationCount = participationCount || 0;
  }
}

export { CampaignParticipantActivity };
