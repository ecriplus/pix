import Service, { service } from '@ember/service';
import ENV from 'pix-orga/config/environment';

import { ENGLISH_INTERNATIONAL_LOCALE } from './locale.js';

const FRENCH_LOCALE = 'fr';
const PIX_FR_DOMAIN = 'https://pix.fr';
const PIX_STATUS_DOMAIN = 'https://status.pix.org';

export default class Url extends Service {
  @service currentDomain;
  @service currentUser;
  @service locale;

  SHOWCASE_WEBSITE_LOCALE_PATH = {
    ACCESSIBILITY: {
      en: '/accessibility-pix-orga',
      fr: '/accessibilite-pix-orga',
      nl: '/toegankelijkheid-pix-orga',
    },
    CGU: {
      en: '/terms-and-conditions',
      fr: '/conditions-generales-d-utilisation',
      nl: '/algemene-gebruiksvoorwaarden',
    },
    DATA_PROTECTION_POLICY: {
      en: '/personal-data-protection-policy',
      fr: '/politique-protection-donnees-personnelles-app',
      nl: '/beleid-inzake-de-bescherming-van-persoonsgegevens',
    },
    LEGAL_NOTICE: {
      en: '/legal-notice',
      fr: '/mentions-legales',
      nl: '/wettelijke-vermeldingen',
    },
  };

  definedCampaignsRootUrl = ENV.APP.CAMPAIGNS_ROOT_URL;
  pixAppUrlWithoutExtension = ENV.APP.PIX_APP_URL_WITHOUT_EXTENSION;

  definedHomeUrl = ENV.rootURL;

  getLegalDocumentUrl(path) {
    return `${this._getPixWebsiteUrl()}/${path}`;
  }

  get campaignsRootUrl() {
    return this.definedCampaignsRootUrl
      ? this.definedCampaignsRootUrl
      : `${this.pixAppUrlWithoutExtension}${this.currentDomain.getExtension()}/campagnes/`;
  }

  get homeUrl() {
    return `${this.definedHomeUrl}?lang=${this._getCurrentLanguage()}`;
  }

  get legalNoticeUrl() {
    const { en, fr, nl } = this.SHOWCASE_WEBSITE_LOCALE_PATH.LEGAL_NOTICE;
    return this._computeShowcaseWebsiteUrl({ en, fr, nl });
  }

  get cguUrl() {
    const { en, fr, nl } = this.SHOWCASE_WEBSITE_LOCALE_PATH.CGU;
    return this._computeShowcaseWebsiteUrl({ en, fr, nl });
  }

  get dataProtectionPolicyUrl() {
    const { en, fr, nl } = this.SHOWCASE_WEBSITE_LOCALE_PATH.DATA_PROTECTION_POLICY;
    return this._computeShowcaseWebsiteUrl({ en, fr, nl });
  }

  get accessibilityUrl() {
    const { en, fr, nl } = this.SHOWCASE_WEBSITE_LOCALE_PATH.ACCESSIBILITY;
    return this._computeShowcaseWebsiteUrl({ en, fr, nl });
  }

  get serverStatusUrl() {
    return `${PIX_STATUS_DOMAIN}?locale=${this._getCurrentLanguage()}`;
  }

  get forgottenPasswordUrl() {
    let url = `${this.pixAppUrlWithoutExtension}${this.currentDomain.getExtension()}/mot-de-passe-oublie`;
    if (this._getCurrentLanguage() !== FRENCH_LOCALE) {
      url += `?lang=${this._getCurrentLanguage()}`;
    }

    return url;
  }

  _getCurrentLanguage() {
    return this.locale.currentLocale;
  }

  get pixJuniorSchoolUrl() {
    const schoolCode = this.currentUser.organization.schoolCode;
    if (!schoolCode) {
      return '';
    }

    return `${this.currentDomain.getJuniorBaseUrl()}/schools/${schoolCode}`;
  }

  _getPixWebsiteUrl() {
    if (this.currentDomain.isFranceDomain) {
      return PIX_FR_DOMAIN;
    }
    const currentLocale = this.locale.currentLocale;
    let locale;
    if (currentLocale == 'nl') {
      locale = 'nl-BE';
    } else if (this.locale.isSupportedLocale(currentLocale)) {
      locale = currentLocale;
    } else {
      locale = ENGLISH_INTERNATIONAL_LOCALE;
    }

    return `https://pix.org/${locale}`;
  }

  _computeShowcaseWebsiteUrl(translations) {
    const websiteUrl = this._getPixWebsiteUrl();

    if (this.currentDomain.isFranceDomain) {
      return `${websiteUrl}${translations.fr}`;
    }

    const currentLanguage = this._getCurrentLanguage();
    if (this.locale.pixLanguages.includes(currentLanguage)) {
      return `${websiteUrl}${translations[currentLanguage]}`;
    }

    return 'https://pix.org/fr/mentions-legales';
  }
}
