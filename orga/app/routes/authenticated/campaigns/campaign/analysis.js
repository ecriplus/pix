import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AnalysisRoute extends Route {
  @service featureToggles;
  @service router;

  beforeModel(transition) {
    const campaignId = transition.to.parent.params.campaign_id;
    const places = this.modelFor('authenticated');

    if (places?.hasReachedMaximumPlacesLimit) {
      this.router.replaceWith('authenticated.campaigns.campaign', campaignId);
    }
  }

  async model() {
    const campaign = this.modelFor('authenticated.campaigns.campaign');
    const analysisData = await campaign.campaignResultLevelsPerTubesAndCompetence;
    await campaign.belongsTo('campaignCollectiveResult').reload();
    return { campaign, analysisData };
  }
}
