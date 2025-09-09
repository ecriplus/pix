import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SettingsRoute extends Route {
  @service router;

  beforeModel(transition) {
    const campaignId = transition.to.parent.params.campaign_id;
    const campaign = this.modelFor('authenticated.campaigns.campaign');

    if (campaign.isFromCombinedCourse) {
      this.router.replaceWith('authenticated.campaigns.campaign', campaignId);
    }
  }

  model() {
    return this.modelFor('authenticated.campaigns.campaign');
  }
}
