import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ProfileRoute extends Route {
  @service router;
  @service store;

  beforeModel(transition) {
    const campaignId = transition.to.params.campaign_id;
    const places = this.modelFor('authenticated');

    if (places?.hasReachedMaximumPlacesLimit) {
      this.router.replaceWith('authenticated.campaigns.campaign', campaignId);
    }
  }

  async model(params) {
    try {
      const { campaign_id: campaignId, campaign_participation_id: campaignParticipationId } = params;
      const campaign = await this.store.findRecord('campaign', campaignId);
      const campaignProfile = await this.store.queryRecord('campaign-profile', { campaignId, campaignParticipationId });

      return {
        campaign,
        campaignProfile,
        campaignParticipationId,
      };
    } catch (error) {
      this.send('error', error, this.router.replaceWith('not-found', params.campaign_id));
    }
  }
}
