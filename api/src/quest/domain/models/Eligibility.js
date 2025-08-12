export class Eligibility {
  constructor({ organizationLearner, organization, campaignParticipations = [], passages = [] }) {
    this.organizationLearner = {
      id: organizationLearner?.id,
    };
    this.organization = organization;
    this.campaignParticipations = campaignParticipations;
    this.passages = passages.map((passage) => ({
      moduleId: passage.id,
      isTerminated: passage.status === 'COMPLETED',
    }));
  }

  /**
   * @param {number} campaignParticipationId
   */
  hasCampaignParticipation(campaignParticipationId) {
    return this.campaignParticipations.some(
      (campaignParticipation) => campaignParticipation.id === campaignParticipationId,
    );
  }

  /**
   * @param {number} campaignParticipationId
   */
  buildEligibilityScopedByCampaignParticipationId({ campaignParticipationId }) {
    return new Eligibility({
      organizationLearner: this.organizationLearner,
      organization: this.organization,
      campaignParticipations: this.campaignParticipations.filter((cp) => cp.id === campaignParticipationId),
    });
  }
}
