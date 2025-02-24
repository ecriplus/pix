import lodash from 'lodash';

import { CampaignTypes } from '../../../shared/domain/constants.js';

const { countBy } = lodash;

class OrganizationLearnerActivity {
  constructor({ organizationLearnerId, participations }) {
    this.organizationLearnerId = organizationLearnerId;
    this.participations = participations;
    this.statistics = this.#statistics(participations);
  }

  #getStatisticsForType(participations, campaignType) {
    const participationsForCampaignType = participations.filter(
      (participation) => participation.campaignType === campaignType,
    );

    const { SHARED = 0, TO_SHARE = 0, STARTED = 0 } = countBy(participationsForCampaignType, 'status');

    const statisticForCampaignType = {
      campaignType,
      shared: SHARED,
      to_share: TO_SHARE,
      total: participationsForCampaignType.length,
    };

    if (campaignType === CampaignTypes.ASSESSMENT) {
      return {
        ...statisticForCampaignType,
        started: STARTED,
      };
    }
    return statisticForCampaignType;
  }

  #statistics(participations) {
    return [CampaignTypes.ASSESSMENT, CampaignTypes.PROFILES_COLLECTION].map((campaignType) =>
      this.#getStatisticsForType(participations, campaignType),
    );
  }
}

export { OrganizationLearnerActivity };
