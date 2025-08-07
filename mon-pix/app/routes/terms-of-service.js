import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class TermsOfServiceRoute extends Route {
  @service currentUser;
  @service session;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'authentication');

    if (this.session.isAuthenticatedByGar || !this.currentUser.user.mustValidateTermsOfService) {
      if (this.session.attemptedTransition) {
        this.session.attemptedTransition.retry();
      } else {
        this.router.replaceWith('');
      }
    }
  }

  model() {
    return this.currentUser.user;
  }
}
