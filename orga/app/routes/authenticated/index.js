import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service('store') store;
  @service router;
  @service currentUser;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  beforeModel(transition) {
    if (transition.to.queryParams.preview) {
      return;
    }
    return this.router.replaceWith(this.currentUser.homePage);
  }

  async model() {
    const organization = this.currentUser.organization;
    return await organization.participationStatistics;
  }
}
