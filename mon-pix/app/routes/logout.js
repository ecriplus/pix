import Route from '@ember/routing/route';
import { service } from '@ember/service';
import ENV from 'mon-pix/config/environment';

import Location from '../utils/location';
const AUTHENTICATED_SOURCE_FROM_GAR = ENV.APP.AUTHENTICATED_SOURCE_FROM_GAR;

export default class LogoutRoute extends Route {
  @service session;
  @service url;
  @service campaignStorage;
  @service accessStorage;
  @service router;

  beforeModel() {
    this.session.revokeGarExternalUserToken();
    this.campaignStorage.clearAll();
    this.accessStorage.clearAll();

    if (this.session.isAuthenticated) {
      if (this.session.data.authenticated.source === AUTHENTICATED_SOURCE_FROM_GAR) {
        this.session.alternativeRootURL = '/nonconnecte';
      } else if (this.session.data.authenticated.source !== 'pole_emploi_connect') {
        this.session.alternativeRootURL = null;
      }
      return this.session.invalidate();
    }
    this._redirectToHomePage();
  }

  _redirectToHomePage() {
    Location.replace(this.url.homeUrl);
  }
}
