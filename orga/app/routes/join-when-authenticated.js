import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class JoinWhenAuthenticatedRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'authentication.login');

    const { queryParams } = transition.to;
    const alternativeRootURL = transition.router.generate('join', { queryParams });

    this.session.alternativeRootURL = alternativeRootURL;
    this.session.invalidate();
  }
}
