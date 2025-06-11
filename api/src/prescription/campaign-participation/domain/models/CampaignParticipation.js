import _ from 'lodash';

import {
  AlreadySharedCampaignParticipationError,
  AssessmentNotCompletedError,
  CantImproveCampaignParticipationError,
} from '../../../../../src/shared/domain/errors.js';
import { ArchivedCampaignError } from '../../../campaign/domain/errors.js';
import { CampaignParticipationLoggerContext, CampaignParticipationStatuses } from '../../../shared/domain/constants.js';
import { CampaignParticiationInvalidStatus, CampaignParticipationDeletedError } from '../errors.js';

class CampaignParticipation {
  #loggerContext;

  constructor({
    id,
    createdAt,
    participantExternalId,
    status,
    sharedAt,
    deletedAt,
    deletedBy,
    assessments,
    campaign,
    userId,
    validatedSkillsCount,
    pixScore,
    organizationLearnerId,
  } = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.status = status;
    this.participantExternalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    this.campaign = campaign;
    this.assessments = assessments;
    this.userId = userId;
    this.status = status;
    this.validatedSkillsCount = validatedSkillsCount || null;
    this.pixScore = pixScore || null;
    this.organizationLearnerId = organizationLearnerId;
  }

  static start({ campaign, userId, organizationLearnerId = null, participantExternalId }) {
    const { isAssessment, isExam } = campaign;
    const { STARTED, TO_SHARE } = CampaignParticipationStatuses;
    const status = [isAssessment, isExam].includes(true) ? STARTED : TO_SHARE;

    return new CampaignParticipation({
      campaign,
      userId,
      participantExternalId,
      status,
      organizationLearnerId,
    });
  }

  get isShared() {
    return this.status === CampaignParticipationStatuses.SHARED;
  }

  get isDeleted() {
    return Boolean(this.deletedAt);
  }

  get lastAssessment() {
    return _.maxBy(this.assessments, 'createdAt');
  }

  get campaignId() {
    return _.get(this, 'campaign.id', null);
  }

  get loggerContext() {
    return this.#loggerContext;
  }

  get dataToUpdateOnDeletion() {
    return {
      id: this.id,
      attributes: {
        deletedAt: this.deletedAt,
        deletedBy: this.deletedBy,
        userId: this.userId,
        participantExternalId: this.participantExternalId,
      },
    };
  }

  share() {
    this._canBeShared();
    this.sharedAt = new Date();
    this.status = CampaignParticipationStatuses.SHARED;
  }

  improve() {
    this._canBeImproved();
    this.status = CampaignParticipationStatuses.STARTED;
  }

  detachUser() {
    this.userId = null;
  }

  anonymize() {
    this.participantExternalId = null;
    this.detachUser();
    this.#loggerContext = CampaignParticipationLoggerContext.ANONYMIZATION;
  }

  delete(userId, isAnonymizedEnabled = false) {
    if (isAnonymizedEnabled) {
      this.anonymize();
    }

    this.deletedAt = new Date();
    this.deletedBy = userId;

    this.#loggerContext = CampaignParticipationLoggerContext.DELETION;
  }

  _canBeImproved() {
    if (this.status !== CampaignParticipationStatuses.TO_SHARE) {
      throw new CampaignParticiationInvalidStatus(this.id, CampaignParticipationStatuses.TO_SHARE);
    }

    if (this.campaign.isProfilesCollection) {
      throw new CantImproveCampaignParticipationError();
    }
  }

  _canBeShared() {
    if (this.status === CampaignParticipationStatuses.STARTED) {
      throw new CampaignParticiationInvalidStatus(this.id, CampaignParticipationStatuses.STARTED);
    }

    if (this.isShared) {
      throw new AlreadySharedCampaignParticipationError();
    }
    if (!this.campaign.isAccessible) {
      throw new ArchivedCampaignError('Cannot share results on an archived campaign.');
    }
    if (this.isDeleted) {
      throw new CampaignParticipationDeletedError('Cannot share results on a deleted participation.');
    }
    if (this.campaign.isAssessment && lastAssessmentNotCompleted(this)) {
      throw new AssessmentNotCompletedError();
    }
  }
}

function lastAssessmentNotCompleted(campaignParticipation) {
  return !campaignParticipation.lastAssessment || !campaignParticipation.lastAssessment.isCompleted();
}

export { CampaignParticipation };
