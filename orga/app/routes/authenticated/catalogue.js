import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedCatalogue extends Route {
  @service currentUser;
  @service router;
  @service featureToggles;

  beforeModel() {
    if (!this.currentUser.canAccessCampaignsPage) {
      return this.router.replaceWith('authenticated.index');
    }
    if (!this.featureToggles.featureToggles?.displayCatalogue) {
      return this.router.replaceWith('authenticated.index');
    }
  }
}
