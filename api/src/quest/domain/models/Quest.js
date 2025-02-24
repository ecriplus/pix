import { COMPARISONS as _CRITERION_COMPARISONS } from './CriterionProperty.js';
import {
  COMPARISONS as _REQUIREMENT_COMPARISONS,
  ComposedRequirement,
  TYPES as _REQUIREMENT_TYPES,
} from './Requirement.js';
/**
 * @typedef {import ('./DataForQuest.js').DataForQuest} DataForQuest
 */

export const REQUIREMENT_COMPARISONS = _REQUIREMENT_COMPARISONS;
export const CRITERION_COMPARISONS = _CRITERION_COMPARISONS;
export const REQUIREMENT_TYPES = _REQUIREMENT_TYPES;

class Quest {
  #eligibilityRequirements;
  #successRequirements;

  constructor({ id, createdAt, updatedAt, rewardType, eligibilityRequirements, successRequirements, rewardId }) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.rewardType = rewardType;
    this.rewardId = rewardId;
    this.#eligibilityRequirements = new ComposedRequirement({
      data: eligibilityRequirements,
      comparison: REQUIREMENT_COMPARISONS.ALL,
    });

    this.#successRequirements = new ComposedRequirement({
      data: successRequirements,
      comparison: REQUIREMENT_COMPARISONS.ALL,
    });
  }

  get eligibilityRequirements() {
    return this.#eligibilityRequirements.data;
  }

  get successRequirements() {
    return this.#successRequirements.data;
  }

  /**
   * @param {DataForQuest} data
   * @param {number} campaignParticipationId
   */
  isCampaignParticipationContributingToQuest({ data, campaignParticipationId }) {
    const scopedData = data.buildDataForQuestScopedByCampaignParticipationId({ campaignParticipationId });

    const campaignParticipationRequirements = this.#flattenRequirementsByType(
      this.#eligibilityRequirements.data,
      REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
    );

    if (campaignParticipationRequirements.length > 0) {
      const a = new ComposedRequirement({
        data: campaignParticipationRequirements,
        comparison: REQUIREMENT_COMPARISONS.ONE_OF,
      });
      return a.isFulfilled(scopedData);
    }

    return false;
  }

  /**
   * @param {DataForQuest} data
   */
  isEligible(data) {
    return this.#eligibilityRequirements.isFulfilled(data);
  }

  /**
   * @param {DataForQuest} data
   */
  isSuccessful(data) {
    return this.#successRequirements.isFulfilled(data);
  }

  toDTO() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      rewardType: this.rewardType,
      rewardId: this.rewardId,
      eligibilityRequirements: this.#eligibilityRequirements.data.map((item) => item.toDTO()),
      successRequirements: this.#successRequirements.data.map((item) => item.toDTO()),
    };
  }

  #flattenRequirementsByType(requirements, type) {
    let result = [];
    const filteredRequirements = requirements.filter((requirement) =>
      [type, REQUIREMENT_TYPES.COMPOSE].includes(requirement.requirement_type),
    );
    for (const requirement of filteredRequirements) {
      if (requirement.requirement_type === REQUIREMENT_TYPES.COMPOSE) {
        result = result.concat(this.#flattenRequirementsByType(requirement.data, type));
      } else {
        result.push(requirement);
      }
    }
    return result;
  }
}

export { Quest };
