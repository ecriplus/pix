import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedStatisticsRoute extends Route {
  @service currentUser;
  @service router;
  @service store;

  beforeModel() {
    if (!this.currentUser.canAccessStatisticsPage) {
      this.router.replaceWith('application');
    }
  }

  model() {
    return this.store.queryRecord('analysis-by-tube', { organizationId: this.currentUser.organization.id });
  }
}
