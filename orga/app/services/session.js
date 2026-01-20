import { action } from '@ember/object';
import { service } from '@ember/service';
import SessionService from 'ember-simple-auth/services/session';

export default class CurrentSessionService extends SessionService {
  @service currentUser;
  @service url;
  @service router;

  routeAfterAuthentication = 'authenticated';
  routeAfterInvalidation = null;

  async handleAuthentication() {
    super.handleAuthentication(this.routeAfterAuthentication);
  }

  async invalidateWithError(errorCode) {
    this.routeAfterInvalidation = this.router.urlFor('authentication.login', { queryParams: { error: errorCode } });
    await this.invalidate();
  }

  handleInvalidation() {
    this.store.clear();
    super.handleInvalidation(this.routeAfterInvalidation || this.url.homeUrl);
    this.routeAfterInvalidation = null;
  }

  waitBeforeInvalidation(millisecondsToWait) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), millisecondsToWait);
    });
  }

  @action
  updateDataAttribute(attribute, value) {
    this.data[attribute] = value;
  }
}
