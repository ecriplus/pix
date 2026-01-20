import { action } from '@ember/object';
import { service } from '@ember/service';
import SessionService from 'ember-simple-auth/services/session';

export default class CurrentSessionService extends SessionService {
  @service currentUser;
  @service url;
  @service router;

  routeAfterAuthentication = 'authenticated';

  async handleAuthentication() {
    super.handleAuthentication(this.routeAfterAuthentication);
  }

  async invalidateWithError(errorCode) {
    this.alternativeRootURL = this.router.urlFor('authentication.login', { queryParams: { error: errorCode } });
    await this.invalidate();
  }

  handleInvalidation() {
    this.store.clear();
    const routeAfterInvalidation = this._getRouteAfterInvalidation();
    super.handleInvalidation(routeAfterInvalidation);
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

  _getRouteAfterInvalidation() {
    const alternativeRootURL = this.alternativeRootURL;
    this.alternativeRootURL = null;

    return alternativeRootURL ? alternativeRootURL : this.url.homeUrl;
  }
}
