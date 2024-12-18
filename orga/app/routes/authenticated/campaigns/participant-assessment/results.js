import Route from '@ember/routing/route';

export default class ResultsRoute extends Route {
  async model() {
    const { campaignAssessmentParticipation } = this.modelFor('authenticated.campaigns.participant-assessment');
    const campaignAssessmentParticipationResult =
      await campaignAssessmentParticipation.campaignAssessmentParticipationResult;
    const competenceResults = await campaignAssessmentParticipationResult.competenceResults;

    return competenceResults.slice(0);
  }
}
