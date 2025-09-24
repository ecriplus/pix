import { service } from '@ember/service';

import UrlBaseService from './url-base.js';

export default class Url extends UrlBaseService {
  @service intl;
  @service locale;

  get cguUrl() {
    return this.getPixWebsiteUrlFor('CGU');
  }

  get legalNoticeUrl() {
    return this.getPixWebsiteUrlFor('LEGAL_NOTICE');
  }

  get dataProtectionPolicyUrl() {
    return this.getPixWebsiteUrlFor('DATA_PROTECTION_POLICY');
  }

  get accessibilityUrl() {
    return this.getPixWebsiteUrlFor('ACCESSIBILITY_CERTIF');
  }

  get supportUrl() {
    return this.getPixWebsiteUrlFor('SUPPORT');
  }

  get joiningIssueSheetUrl() {
    if (this.locale.currentLanguage === 'fr') {
      return 'https://cloud.pix.fr/s/b8BFXX94Ys2WGxM/download/Probl%C3%A8mes%20d%27acc%C3%A8s%20en%20session.pdf';
    }

    return 'https://cloud.pix.fr/s/JmBn2q5rpzgrjxN/download';
  }

  get urlToDownloadSessionIssueReportSheet() {
    return this.intl.t('common.urls.session-issue-report-sheet');
  }

  get urlToDownloadSessionV3IssueReportSheet() {
    return this.intl.t('common.urls.session-v3-issue-report-sheet');
  }

  get fraudFormUrl() {
    return 'https://form-eu.123formbuilder.com/41052/form';
  }

  get fraudReportUrl() {
    return this.intl.t('common.urls.fraud');
  }

  get invigilatorDocumentationUrl() {
    return 'https://cloud.pix.fr/s/s4H9x4PD4eKokqX';
  }
}
