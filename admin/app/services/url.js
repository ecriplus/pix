import Service, { service } from '@ember/service';
import ENV from 'pix-admin/config/environment';

export default class Url extends Service {
  @service currentDomain;
  @service locale;

  definedHomeUrl = ENV.rootURL;
  pixAppUrlWithoutExtension = ENV.APP.PIX_APP_URL_WITHOUT_EXTENSION;

  get homeUrl() {
    return this.definedHomeUrl;
  }

  get forgottenPasswordUrl() {
    const currentLanguage = this.locale.currentLocale;
    let url = `${this.pixAppUrlWithoutExtension}${this.currentDomain.getExtension()}/mot-de-passe-oublie`;
    if (currentLanguage === 'en') {
      url += '?lang=en';
    }
    return url;
  }
}
