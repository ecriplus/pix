import { action } from '@ember/object';
import { service } from '@ember/service';
import SessionService from 'ember-simple-auth/services/session';

export default class CurrentSessionService extends SessionService {
  @service currentUser;
  @service locale;
  @service featureToggles;
  @service url;

  routeAfterAuthentication = 'authenticated';

  async handleAuthentication() {
    await this.loadCurrentUserAndSetLocale();

    super.handleAuthentication(this.routeAfterAuthentication);
  }

  async loadCurrentUserAndSetLocale(transition) {
    await this.currentUser.load();

    const queryParams = transition?.to?.queryParams;
    this.locale.setBestLocale({ user: this.currentUser.prescriber, queryParams });

    if (!this.featureToggles.featureToggles?.useLocale) {
      // should not happen with new locale system because we dont rely on user lang anymore.
      this.data.localeNotSupported = !this.locale.isSupportedLocale(this.currentUser.prescriber?.lang);
    }
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
