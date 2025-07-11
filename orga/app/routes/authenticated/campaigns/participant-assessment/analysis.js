import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AnalysisRoute extends Route {
  @service router;

  beforeModel(transition) {
    const campaignId = transition.to.parent.params.campaign_id;
    const places = this.modelFor('authenticated');

    if (places?.hasReachMaximumPlacesWithThreshold) {
      this.router.replaceWith('authenticated.campaigns.campaign', campaignId);
    }
  }

  model() {
    const { campaignAssessmentParticipation } = this.modelFor('authenticated.campaigns.participant-assessment');
    return campaignAssessmentParticipation;
  }

  afterModel(model) {
    return model.belongsTo('campaignAnalysis').reload();
  }
}
