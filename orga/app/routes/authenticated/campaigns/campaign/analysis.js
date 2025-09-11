import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AnalysisRoute extends Route {
  @service featureToggles;
  @service router;
  @service currentUser;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  beforeModel(transition) {
    const campaignId = transition.to.parent.params.campaign_id;

    if (this.currentUser.placeStatistics?.hasReachedMaximumPlacesLimit) {
      return this.router.replaceWith('authenticated.campaigns.campaign', campaignId);
    }

    if (transition.to.name.endsWith('competences')) {
      return this.router.replaceWith('authenticated.campaigns.campaign.analysis.competences');
    } else {
      return this.router.replaceWith('authenticated.campaigns.campaign.analysis.tubes');
    }
  }

  async model() {
    const campaign = this.modelFor('authenticated.campaigns.campaign');
    const analysisData = await campaign.campaignResultLevelsPerTubesAndCompetence;
    await campaign.belongsTo('campaignCollectiveResult').reload();
    return { campaign, analysisData };
  }
}
