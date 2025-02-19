import { COMPARISONS as _CRITERION_COMPARISONS } from './CriterionProperty.js';
import {
  COMPARISONS as _REQUIREMENT_COMPARISONS,
  ComposedRequirement,
  TYPES as _REQUIREMENT_TYPES,
} from './Requirement.js';
/**
 * @typedef {import ('./Eligibility.js').Eligibility} Eligibility
 * @typedef {import ('./Success.js').Success} Success
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

  // je crois que ce getter sert à rien
  get eligibilityRequirements() {
    return this.#eligibilityRequirements.data;
  }

  // je crois que ce getter sert à rien
  get successRequirements() {
    return this.#successRequirements.data;
  }

  /**
   * @param {Eligibility} eligibility
   * @param {number} campaignParticipationId
   */
  isCampaignParticipationContributingToQuest({ eligibility, campaignParticipationId }) {
    const scopedEligibility = eligibility.buildEligibilityScopedByCampaignParticipationId({ campaignParticipationId });

    const campaignParticipationRequirements = this.#flattenRequirementsByType(
      this.#eligibilityRequirements.data,
      REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
    );

    if (campaignParticipationRequirements.length > 0) {
      const a = new ComposedRequirement({
        data: campaignParticipationRequirements,
        comparison: REQUIREMENT_COMPARISONS.ONE_OF,
      });
      return a.isFulfilled(scopedEligibility);
    }

    return false;
  }

  /**
   * @param {Eligibility} eligibility
   */
  isEligible(eligibility) {
    return this.#eligibilityRequirements.isFulfilled(eligibility);
  }

  /**
   * @param {Success} success
   */
  isSuccessful(success) {
    return this.#successRequirements.isFulfilled(success);
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
