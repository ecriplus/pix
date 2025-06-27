const TYPES = {
  CAMPAIGN_PARTICIPATION_START: 'CAMPAIGN_PARTICIPATION_START',
  CAMPAIGN_PARTICIPATION_COMPLETION: 'CAMPAIGN_PARTICIPATION_COMPLETION',
  CAMPAIGN_PARTICIPATION_SHARING: 'CAMPAIGN_PARTICIPATION_SHARING',
};

class PoleEmploiSending {
  constructor({ campaignParticipationId, type, payload, responseCode = 'DISABLED' }) {
    this.campaignParticipationId = campaignParticipationId;
    this.type = type;
    this.isSuccessful = false;
    this.responseCode = responseCode;
    this.payload = payload;
  }

  static buildForParticipationStarted({ campaignParticipationId, payload, responseCode }) {
    return new PoleEmploiSending({
      campaignParticipationId,
      type: TYPES.CAMPAIGN_PARTICIPATION_START,
      payload,
      responseCode,
    });
  }

  static buildForParticipationFinished({ campaignParticipationId, payload, responseCode }) {
    return new PoleEmploiSending({
      campaignParticipationId,
      type: TYPES.CAMPAIGN_PARTICIPATION_COMPLETION,
      payload,
      responseCode,
    });
  }

  static buildForParticipationShared({ campaignParticipationId, payload, responseCode }) {
    return new PoleEmploiSending({
      campaignParticipationId,
      type: TYPES.CAMPAIGN_PARTICIPATION_SHARING,
      payload,
      responseCode,
    });
  }
}

PoleEmploiSending.TYPES = TYPES;
export { PoleEmploiSending };
