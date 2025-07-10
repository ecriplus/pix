import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class JoinRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    this.session.prohibitAuthentication('authenticated.user-dashboard');
    this.routeIfAlreadyAuthenticated = 'organizations.access';

    super.beforeModel(...arguments);
  }

  async model() {
    return this.modelFor('organizations');
  }
}
