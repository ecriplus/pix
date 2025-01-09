import Service, { inject as service } from '@ember/service';
import ENV from 'pix-orga/config/environment';

const FRENCH_LOCALE = 'fr';
const ENGLISH_LOCALE = 'en';
const DUTCH_LOCALE = 'nl';
const PIX_FR_DOMAIN = 'https://pix.fr';
const PIX_ORG_DOMAIN_FR_LOCALE = 'https://pix.org/fr';
const PIX_ORG_DOMAIN_EN_LOCALE = 'https://pix.org/en';
const PIX_ORG_DOMAIN_NL_LOCALE = 'https://pix.org/nl-be';
const PIX_STATUS_DOMAIN = 'https://status.pix.org';

export default class Url extends Service {
  @service currentDomain;
  @service currentUser;
  @service intl;

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
    return this.intl.primaryLocale;
  }

  get pixJuniorSchoolUrl() {
    const schoolCode = this.currentUser.organization.schoolCode;
    if (!schoolCode) {
      return '';
    }

    return `${this.currentDomain.getJuniorBaseUrl()}/schools/${schoolCode}`;
  }

  _computeShowcaseWebsiteUrl({ en: englishPath, fr: frenchPath, nl: dutchPath }) {
    if (this.currentDomain.isFranceDomain) {
      return `${PIX_FR_DOMAIN}${frenchPath}`;
    }

    switch (this._getCurrentLanguage()) {
      case FRENCH_LOCALE:
        return `${PIX_ORG_DOMAIN_FR_LOCALE}${frenchPath}`;
      case ENGLISH_LOCALE:
        return `${PIX_ORG_DOMAIN_EN_LOCALE}${englishPath}`;
      case DUTCH_LOCALE:
        return `${PIX_ORG_DOMAIN_NL_LOCALE}${dutchPath}`;
      default:
        return 'https://pix.org/fr/mentions-legales';
    }
  }
}
