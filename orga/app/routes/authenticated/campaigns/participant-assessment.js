import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AssessmentRoute extends Route {
  @service router;
  @service store;

  beforeModel(transition) {
    const campaignId = transition.to.parent.params.campaign_id;
    const places = this.modelFor('authenticated');

    if (places?.hasReachedMaximumPlacesLimit) {
      this.router.replaceWith('authenticated.campaigns.campaign', campaignId);
    }
  }

  async model(params) {
    try {
      const { campaign_id: campaignId, campaign_participation_id: campaignParticipationId } = params;

      const campaignAssessmentParticipation = await this.store.queryRecord('campaign-assessment-participation', {
        campaignId,
        campaignParticipationId,
      });

      const availableCampaignParticipations = await this.store.query('available-campaign-participation', {
        campaignId,
        organizationLearnerId: campaignAssessmentParticipation.organizationLearnerId,
      });

      const campaign = await this.store.findRecord('campaign', campaignId);

      return {
        campaign,
        campaignAssessmentParticipation,
        availableCampaignParticipations,
      };
    } catch (error) {
      this.send('error', error, this.router.replaceWith('not-found', params.campaign_id));
    }
  }
}
