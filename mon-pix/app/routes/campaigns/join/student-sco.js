import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class StudentScoRoute extends Route {
  @service campaignStorage;
  @service session;
  @service router;

  beforeModel() {
    this.session.prohibitAuthentication('authenticated.user-dashboard');
  }

  async model() {
    const campaign = this.modelFor('campaigns');
    const redirectionUrl = this.session.redirectionUrl;
    return {
      campaign,
      redirectionUrl,
    };
  }

  setupController(controller, model) {
    controller.displayRegisterForm = !this.campaignStorage.get(model.campaign.code, 'hasUserSeenJoinPage');
  }
}
