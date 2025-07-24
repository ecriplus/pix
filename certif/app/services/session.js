import { service } from '@ember/service';
import { runTask } from 'ember-lifeline';
import SessionService from 'ember-simple-auth/services/session';

export default class CurrentSessionService extends SessionService {
  @service currentUser;
  @service locale;

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

    const language = transition?.to?.queryParams?.lang;
    this.locale.detectBestLocale({ language, user: this.currentUser.certificationPointOfContact });

    this.data.localeNotSupported = !this.locale.isSupportedLocale(this.currentUser.certificationPointOfContact?.lang);
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
