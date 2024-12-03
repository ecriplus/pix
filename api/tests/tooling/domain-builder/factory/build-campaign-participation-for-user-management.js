import { CampaignParticipationForUserManagement } from '../../../../src/prescription/campaign-participation/domain/models/CampaignParticipationForUserManagement.js';
import { CampaignParticipationStatuses } from '../../../../src/prescription/shared/domain/constants.js';

const buildCampaignParticipationForUserManagement = function ({
  id = 1,
  participantExternalId = 'un identifiant externe',
  campaignParticipationId,
  status = CampaignParticipationStatuses.TO_SHARE,
  campaignId = 2,
  campaignCode = 'SOMECODE0',
  createdAt = new Date(),
  sharedAt = null,
  updatedAt = null,
  organizationLearnerFirstName = null,
  organizationLearnerLastName = null,
} = {}) {
  return new CampaignParticipationForUserManagement({
    id,
    campaignId,
    campaignCode,
    campaignParticipationId,
    participantExternalId,
    status,
    createdAt,
    sharedAt,
    updatedAt,
    organizationLearnerFirstName,
    organizationLearnerLastName,
  });
};

export { buildCampaignParticipationForUserManagement };
