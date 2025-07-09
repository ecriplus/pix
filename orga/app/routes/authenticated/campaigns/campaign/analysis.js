import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AnalysisRoute extends Route {
  @service featureToggles;
  @service router;

  beforeModel(transition) {
    const campaignId = transition.to.params.campaign_id;
    const places = this.modelFor('authenticated');

    if (places?.hasReachMaximumPlacesWithThreshold) {
      this.router.replaceWith('authenticated.campaigns.campaign', campaignId);
    }
  }

  async model() {
    const campaign = this.modelFor('authenticated.campaigns.campaign');
    const isNewPage = this.featureToggles.featureToggles.shouldDisplayNewAnalysisPage;
    const analysisModel = isNewPage ? 'campaignResultLevelsPerTubesAndCompetence' : 'campaignAnalysis';

    const analysisData = await campaign[analysisModel];
    await campaign.belongsTo('campaignCollectiveResult').reload();
    return { campaign, analysisData, isNewPage };
  }
}
