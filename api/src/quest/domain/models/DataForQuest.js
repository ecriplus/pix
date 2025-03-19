export class DataForQuest {
  #success;
  #eligibility;

  constructor({ eligibility, success = null }) {
    this.#success = success;
    this.#eligibility = eligibility;
  }

  get eligibility() {
    return Object.freeze(this.#eligibility);
  }

  get success() {
    return Object.freeze(this.#success);
  }

  set success(value) {
    this.#success = value;
  }

  /*
   * Eligibility
   */

  get organizationLearner() {
    return this.#eligibility.organizationLearner;
  }

  get organization() {
    return this.#eligibility.organization;
  }

  get campaignParticipations() {
    return this.#eligibility.campaignParticipations;
  }

  buildDataForQuestScopedByCampaignParticipationId(...args) {
    const eligibility = this.#eligibility.buildEligibilityScopedByCampaignParticipationId(...args);
    return new DataForQuest({ eligibility, success: this.#success });
  }

  hasCampaignParticipation(...args) {
    return this.#eligibility.hasCampaignParticipation(...args);
  }

  /*
   * Success
   */

  get knowledgeElements() {
    return this.#success.knowledgeElements;
  }

  // TODO :  stop using this mystical args ?
  getMasteryPercentageForSkills(...args) {
    return this.#success.getMasteryPercentageForSkills(...args);
  }

  // TODO :  stop using this mystical args ?
  getMasteryPercentageForCappedTubes(...args) {
    return this.#success.getMasteryPercentageForCappedTubes(...args);
  }
}
