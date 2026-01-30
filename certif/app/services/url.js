import { service } from '@ember/service';

import UrlBaseService from './url-base.js';

export default class Url extends UrlBaseService {
  @service currentUser;
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
      return 'https://cloud.pix.fr/s/QcKnpcTya5iWF5C';
    }

    return 'https://cloud.pix.fr/s/aZRMYipSLREiBXP';
  }

  get documentationUrl() {
    if (this.currentUser.currentAllowedCertificationCenterAccess.isScoManagingStudents) {
      return this.intl.t('common.urls.documentation.sco-managing-students');
    }
    return this.intl.t('common.urls.documentation.other');
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
    if (this.locale.currentLanguage === 'fr') {
      return 'https://cloud.pix.fr/s/8xB82zdPKYSZzaM';
    }

    return 'https://cloud.pix.fr/s/Mfd2ggwGHwmprA4';
  }
}
