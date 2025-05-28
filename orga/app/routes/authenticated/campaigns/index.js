import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  beforeModel() {
    return this.router.replaceWith('authenticated.campaigns.list.my-campaigns');
  }
}
