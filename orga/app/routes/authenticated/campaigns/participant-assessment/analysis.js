import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AnalysisRoute extends Route {
  @service router;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  beforeModel(transition) {
    const campaignId = transition.to.parent.params.campaign_id;
    const places = this.modelFor('authenticated');

    if (places?.hasReachedMaximumPlacesLimit) {
      return this.router.replaceWith('authenticated.campaigns.campaign', campaignId);
    }

    if (transition.to.name.endsWith('competences')) {
      return this.router.replaceWith('authenticated.campaigns.participant-assessment.analysis.competences');
    } else {
      return this.router.replaceWith('authenticated.campaigns.participant-assessment.analysis.tubes');
    }
  }

  async model() {
    const { campaignAssessmentParticipation } = this.modelFor('authenticated.campaigns.participant-assessment');
    const analysisData = await campaignAssessmentParticipation.campaignParticipationLevelsPerTubesAndCompetence;
    return { analysisData, isForParticipant: true };
  }
}
