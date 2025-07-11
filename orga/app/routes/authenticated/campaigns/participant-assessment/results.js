import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ResultsRoute extends Route {
  @service router;

  beforeModel(transition) {
    const campaignId = transition.to.params.campaign_id;
    const places = this.modelFor('authenticated');

    if (places?.hasReachedMaximumPlacesLimit) {
      this.router.replaceWith('authenticated.campaigns.campaign', campaignId);
    }
  }

  async model() {
    const { campaignAssessmentParticipation } = this.modelFor('authenticated.campaigns.participant-assessment');
    const campaignAssessmentParticipationResult =
      await campaignAssessmentParticipation.campaignAssessmentParticipationResult;
    const competenceResults = await campaignAssessmentParticipationResult.competenceResults;

    return competenceResults.slice(0);
  }
}
