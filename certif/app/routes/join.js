import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class JoinRoute extends Route {
  @service store;
  @service router;
  @service session;

  queryParams = {
    code: { replace: true },
    invitationId: { replace: true },
  };

  routeIfAlreadyAuthenticated = 'join-when-authenticated';

  beforeModel() {
    this.session.prohibitAuthentication(this.routeIfAlreadyAuthenticated);
  }

  model(params) {
    return this.store
      .queryRecord('certification-center-invitation', {
        invitationId: params.invitationId,
        code: params.code,
      })
      .catch(() => {
        this.router.replaceWith('login');
      });
  }
}
