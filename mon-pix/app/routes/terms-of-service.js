import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class TermsOfServiceRoute extends Route {
  @service currentUser;
  @service session;
  @service router;

  beforeModel(transition) {
    if (this.session.isAuthenticatedByGar || !this.currentUser.user.mustValidateTermsOfService) {
      if (this.session.attemptedTransition) {
        this.session.attemptedTransition.retry();
      } else {
        this.router.replaceWith('');
      }
    }

    this.session.requireAuthentication(transition, 'login');
  }

  model() {
    return this.currentUser.user;
  }
}
