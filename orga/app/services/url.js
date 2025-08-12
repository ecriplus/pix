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

  get campaignsRootUrl() {
    if (ENV.APP.CAMPAIGNS_ROOT_URL) return ENV.APP.CAMPAIGNS_ROOT_URL;
    return `${this.pixAppUrl}/campagnes/`;
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
