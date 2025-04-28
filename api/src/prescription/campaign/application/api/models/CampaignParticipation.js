import _ from 'lodash';

class CampaignParticipation {
  /**
   * @typedef {Object} CampaignParticipationArgs
   * @property {string} participantFirstName
   * @property {string} participantLastName
   * @property {string | null} participantExternalId
   * @property {number} userId
   * @property {number} campaignParticipationId
   * @property {Date} createdAt
   * @property {Date | null} sharedAt
   * @property {string} status
   */

  /**
   * @param {CampaignParticipationArgs} args
   */
  constructor({
    participantFirstName,
    participantLastName,
    participantExternalId = null,
    userId,
    campaignParticipationId,
    createdAt,
    sharedAt,
    status,
  } = {}) {
    this.participantFirstName = participantFirstName;
    this.participantLastName = participantLastName;
    this.participantExternalId = participantExternalId;
    this.userId = userId;
    this.campaignParticipationId = campaignParticipationId;
    this.createdAt = createdAt;
    this.sharedAt = sharedAt;
    this.status = status;
  }

  get id() {
    return this.campaignParticipationId;
  }

  get isShared() {
    return Boolean(this.sharedAt);
  }
}

/**
 * @typedef {object} AssessmentCampaignParticipationArgs
 * @extends CampaignParticipationArgs
 * @property {number} masteryRate
 * @property {Array<TubeCoverage>} tubes
 */

/**
 * @typedef {object} TubeCoverage
 * @property {string} id
 * @property {string} competenceId
 * @property {number} reachedLevel
 * @property {number} maxLevel
 * @property {string} practicalTitle
 * @property {string} practicalDescription
 */

/**
 * @class
 */
class AssessmentCampaignParticipation extends CampaignParticipation {
  /**
   * @param {AssessmentCampaignParticipationArgs} args
   */
  constructor(args) {
    super(args);
    this.masteryRate = !_.isNil(args.masteryRate) ? Number(args.masteryRate) : null;
    this.tubes = args.tubes;
  }
}

/**
 * @typedef {object} ProfilesCollectionCampaignParticipationArgs
 * @extends CampaignParticipationArgs
 * @property {number} pixScore
 */

class ProfilesCollectionCampaignParticipation extends CampaignParticipation {
  /**
   * @param {ProfilesCollectionCampaignParticipationArgs} args
   */
  constructor(args) {
    super(args);
    this.pixScore = args.pixScore;
  }
}

export { AssessmentCampaignParticipation, CampaignParticipation, ProfilesCollectionCampaignParticipation };
