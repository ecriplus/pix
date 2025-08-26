import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;
  @service currentUser;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  beforeModel() {
    if (!this.currentUser.canAccessCampaignsPage) {
      return this.router.replaceWith('authenticated.index');
    }
    return this.router.replaceWith('authenticated.campaigns.list.my-campaigns');
  }
}
