import { CombinedCourse } from './CombinedCourse.js';
import { COMPARISONS as CITERION_PROPERTY_COMPARISONS } from './CriterionProperty.js';
import { Quest } from './Quest.js';
import { buildRequirement, COMPARISONS, TYPES } from './Requirement.js';

export class CombinedCourseTemplate {
  #quest;
  #name;

  constructor({ name, successRequirements }) {
    const now = new Date();
    this.#name = name;
    this.#quest = new Quest({
      createdAt: now,
      updatedAt: now,
      rewardType: null,
      rewardId: null,
      eligibilityRequirements: [],
      successRequirements,
    });
  }

  get targetProfileIds() {
    return this.#quest.successRequirements
      .filter((requirement) => requirement.requirement_type === TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS)
      .map(({ data }) => data.targetProfileId.data);
  }

  toCombinedCourse(code, organizationId, campaigns) {
    const quest = this.toCombinedCourseQuestFormat(campaigns);
    return new CombinedCourse({ name: this.#name, code, organizationId }, quest);
  }

  toCombinedCourseQuestFormat(campaigns) {
    const successRequirements = this.#quest.successRequirements.map((requirement) => {
      if (requirement.requirement_type === TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS) {
        const requirementTargetProfileId = requirement.data.targetProfileId.data;
        const campaignId = campaigns.find(({ targetProfileId }) => targetProfileId === requirementTargetProfileId).id;
        return buildRequirement({
          requirement_type: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: COMPARISONS.ALL,
          data: {
            campaignId: { data: campaignId, comparison: CITERION_PROPERTY_COMPARISONS.EQUAL },
            status: { data: 'SHARED', comparison: CITERION_PROPERTY_COMPARISONS.EQUAL },
          },
        });
      } else if (requirement.requirement_type === TYPES.OBJECT.PASSAGES) {
        return buildRequirement({
          requirement_type: TYPES.OBJECT.PASSAGES,
          comparison: COMPARISONS.ALL,
          data: {
            ...requirement.data,
            isTerminated: { data: true, comparison: CITERION_PROPERTY_COMPARISONS.EQUAL },
          },
        });
      } else {
        return requirement;
      }
    });
    return new Quest({
      ...this.#quest,
      successRequirements,
      eligibilityRequirements: [],
    });
  }
}
