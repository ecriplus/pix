import { action } from '@ember/object';
import { service } from '@ember/service';
import SessionService from 'ember-simple-auth/services/session';

export default class CurrentSessionService extends SessionService {
  @service currentUser;
  @service locale;
  @service url;

  routeAfterAuthentication = 'authenticated';

  async handleAuthentication() {
    await this.loadCurrentUserAndSetLocale();

    super.handleAuthentication(this.routeAfterAuthentication);
  }

  async loadCurrentUserAndSetLocale(transition) {
    await this.currentUser.load();

    const queryParams = transition?.to?.queryParams;
    this.locale.setBestLocale({ queryParams });
    this.data.localeNotSupported = false;
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
