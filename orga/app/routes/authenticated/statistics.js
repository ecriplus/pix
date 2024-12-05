import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedStatisticsRoute extends Route {
  @service currentUser;
  @service router;

  beforeModel() {
    if (!this.currentUser.canAccessStatisticsPage) {
      this.router.replaceWith('application');
    }
  }
}
