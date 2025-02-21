import { ORGANIZATION_FEATURE } from '../../../../../src/shared/domain/constants.js';
import { CampaignTypes } from '../../../shared/domain/constants.js';
import {
  OrganizationNotAuthorizedMultipleSendingAssessmentToCreateCampaignError,
  UserNotAuthorizedToCreateCampaignError,
} from '../errors.js';
import { CampaignForCreation } from './CampaignForCreation.js';

class CampaignCreator {
  constructor({ availableTargetProfileIds, organizationFeatures }) {
    this.availableTargetProfileIds = availableTargetProfileIds;
    this.isMultipleSendingsAssessmentEnable =
      organizationFeatures[ORGANIZATION_FEATURE.MULTIPLE_SENDING_ASSESSMENT.key];
  }

  createCampaign(campaignAttributes) {
    const { type, targetProfileId, multipleSendings, organizationId } = campaignAttributes;

    if (type === CampaignTypes.ASSESSMENT) {
      _checkAssessmentCampaignCreationAllowed(targetProfileId, this.availableTargetProfileIds);
      _checkAssessmentCampaignMultipleSendingsCreationAllowed(
        multipleSendings,
        this.isMultipleSendingsAssessmentEnable,
        organizationId,
      );
    }

    return new CampaignForCreation(campaignAttributes);
  }

  #checkAssessmentCampaignCreationAllowed(targetProfileId) {
    if (targetProfileId && !this.availableTargetProfileIds.includes(targetProfileId)) {
      throw new UserNotAuthorizedToCreateCampaignError(
        `Organization does not have an access to the profile ${targetProfileId}`,
      );
    }
  }

  #checkAssessmentCampaignMultipleSendingsCreationAllowed(multipleSendings, organizationId) {
    if (!this.isMultipleSendingsAssessmentEnable && multipleSendings) {
      throw new OrganizationNotAuthorizedMultipleSendingAssessmentToCreateCampaignError(organizationId);
    }
  }
}

export { CampaignCreator };
