import Route from '@ember/routing/route';
import { service } from '@ember/service';
import ENV from 'pix-admin/config/environment';

export const { DEFAULT_LOCALE } = ENV.APP;
export const FRENCH_INTERNATIONAL_LOCALE = 'fr';

export default class ApplicationRoute extends Route {
  @service session;
  @service intl;
  @service currentDomain;
  @service currentUser;
  @service featureToggles;

  async beforeModel() {
    await this.session.setup();

    if (this.currentDomain.isFranceDomain) {
      this.intl.setLocale(FRENCH_INTERNATIONAL_LOCALE);
    } else {
      this.intl.setLocale(DEFAULT_LOCALE);
    }

    await this.featureToggles.load();

    return this._loadCurrentUser();
  }

  _loadCurrentUser() {
    return this.currentUser.load();
  }
}
