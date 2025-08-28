import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class UserAccountLanguageRoute extends Route {
  @service router;
  @service currentDomain;

  beforeModel() {
    if (this.currentDomain.isFranceDomain) {
      this.router.replaceWith('authenticated.user-account');
    }
  }

  model() {
    return this.modelFor('authenticated.user-account');
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.showLanguageUpdatedMessage = false;
  }
}
