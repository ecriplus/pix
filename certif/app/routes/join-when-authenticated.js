import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class JoinWhenAuthenticatedRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    console.log('________');
    console.log('________');

    const { queryParams } = transition.to;
    const alternativeRootURL = transition.router.generate('join', { queryParams });

    this.session.alternativeRootURL = alternativeRootURL;
    console.log(' this.session.alternativeRootURL ', this.session.alternativeRootURL);
    this.session.invalidate();
  }
}
