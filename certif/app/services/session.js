import { service } from '@ember/service';
import { runTask } from 'ember-lifeline';
import SessionService from 'ember-simple-auth/services/session';

export default class CurrentSessionService extends SessionService {
  @service currentUser;
  @service locale;
  @service featureToggles;

  async handleAuthentication() {
    await this.loadCurrentUserAndSetLocale();

    const isCurrentUserMemberOfACertificationCenter =
      this.currentUser.certificationPointOfContact.isMemberOfACertificationCenter;
    const routeAfterAuthentication = isCurrentUserMemberOfACertificationCenter
      ? 'authenticated'
      : 'login-session-supervisor';
    super.handleAuthentication(routeAfterAuthentication);
  }

  async loadCurrentUserAndSetLocale(transition) {
    await this.currentUser.load();

    const queryParams = transition?.to?.queryParams;
    this.locale.setBestLocale({ queryParams });

    this.data.localeNotSupported = false;
  }

  handleInvalidation() {
    this.store.clear();
    super.handleInvalidation('/connexion');
  }

  waitBeforeInvalidation(millisecondsToWait) {
    return new Promise((resolve) => {
      runTask(this, resolve, millisecondsToWait);
    });
  }

  updateDataAttribute(attribute, value) {
    this.data[attribute] = value;
  }
}
