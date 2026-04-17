import { service } from '@ember/service';
import ENV from 'pix-orga/config/environment';

import UrlBaseService from './url-base.js';

export default class Url extends UrlBaseService {
  @service currentDomain;
  @service currentUser;

  get legalNoticeUrl() {
    return this.getPixWebsiteUrlFor('LEGAL_NOTICE');
  }

  get cguUrl() {
    return this.getPixWebsiteUrlFor('CGU');
  }

  get dataProtectionPolicyUrl() {
    return this.getPixWebsiteUrlFor('DATA_PROTECTION_POLICY');
  }

  get accessibilityUrl() {
    return this.getPixWebsiteUrlFor('ACCESSIBILITY_ORGA');
  }

  get supportHomeUrl() {
    return this.getPixWebsiteUrlFor('SUPPORT');
  }

  get supportHelpCenterUrl() {
    const locale = this.locale.currentLocale;
    const orgType = this.currentUser.organization?.type ?? 'PRO';

    switch (orgType) {
      case 'SCO-1D':
        return this.getPixWebsiteUrlFor('SUPPORT_SCO1D');
      case 'SCO':
        return this.getPixWebsiteUrlFor('SUPPORT_SCO');
      default:
        return locale === 'fr' || locale === 'fr-FR'
          ? 'https://contact.pix.org/fr/hc/1137130200'
          : this.getPixWebsiteUrlFor('SUPPORT');
    }
  }

  get campaignsRootUrl() {
    if (ENV.APP.CAMPAIGNS_ROOT_URL) return ENV.APP.CAMPAIGNS_ROOT_URL;
    return `${this.pixAppUrl}/campagnes/`;
  }

  get combinedCoursesRootUrl() {
    if (ENV.APP.COMBINED_COURSES_ROOT_URL) return ENV.APP.COMBINED_COURSES_ROOT_URL;
    return `${this.pixAppUrl}/parcours/`;
  }

  get pixJuniorSchoolUrl() {
    const schoolCode = this.currentUser.organization.schoolCode;
    if (!schoolCode) return '';

    return `${this.currentDomain.getJuniorBaseUrl()}/schools/${schoolCode}`;
  }

  get pixJuniorUrl() {
    return this.currentDomain.getJuniorBaseUrl();
  }

  getLegalDocumentUrl(path) {
    return this.getPixWebsiteUrl(path);
  }
}
