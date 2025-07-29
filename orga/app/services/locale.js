// This file is a COPY of an original file from mon-pix.
// If you need a change, as much as possible modify the original file
// and propagate the changes in the copies in all the fronts

import { getOwner } from '@ember/application';
import Service, { service } from '@ember/service';
import ENV from 'pix-orga/config/environment';

const { DEFAULT_LOCALE, SUPPORTED_LOCALES, COOKIE_LOCALE_LIFESPAN_IN_SECONDS } = ENV.APP;

export const FRENCH_FRANCE_LOCALE = 'fr-FR';
export const FRENCH_INTERNATIONAL_LOCALE = 'fr';
export const ENGLISH_INTERNATIONAL_LOCALE = 'en';

const PIX_LOCALES = ['en', 'es', 'fr', 'fr-BE', 'fr-FR', 'nl-BE', 'nl'];

// Currently the challenge locales are not in canonical locales, thus the "fr-fr" value.
// This cannot be changed without migrating the challenges content.
const PIX_CHALLENGE_LOCALES = ['en', 'fr', 'fr-fr', 'nl', 'es', 'it', 'de'];

const PIX_LANGUAGES = [
  { value: 'fr', originalName: 'Français', shouldBeDisplayedInLanguageSwitcher: true },
  { value: 'en', originalName: 'English', shouldBeDisplayedInLanguageSwitcher: true },
  { value: 'nl', originalName: 'Nederlands', shouldBeDisplayedInLanguageSwitcher: true },
  { value: 'es', originalName: 'Español', shouldBeDisplayedInLanguageSwitcher: false },
];

export default class LocaleService extends Service {
  @service cookies;
  @service currentDomain;
  @service intl;
  @service dayjs;

  get supportedLocales() {
    return SUPPORTED_LOCALES;
  }

  get currentLocale() {
    return this.intl.primaryLocale;
  }

  /**
   * Returns all locales available in the Pix platform
   */
  get pixLocales() {
    return PIX_LOCALES;
  }

  /**
   * Returns all languages available in the Pix platform
   * @deprecated use pixLocales instead whenever possible.
   */
  get pixLanguages() {
    return PIX_LANGUAGES.map((elem) => elem.value);
  }

  get acceptLanguageHeader() {
    if (this.currentDomain.isFranceDomain) return FRENCH_FRANCE_LOCALE;
    return this.currentLocale;
  }

  /**
   * Returns all locales available in challenges of the Pix platform
   */
  get pixChallengeLocales() {
    return PIX_CHALLENGE_LOCALES;
  }

  get switcherDisplayedLanguages() {
    return PIX_LANGUAGES.filter(
      (elem) => this.supportedLocales.includes(elem.value) && elem.shouldBeDisplayedInLanguageSwitcher,
    ).map((elem) => ({ value: elem.value, label: elem.originalName }));
  }

  isSupportedLocale(locale) {
    try {
      const localeCanonicalName = Intl.getCanonicalLocales(locale)?.[0];
      return this.supportedLocales.some((supportedLocale) => localeCanonicalName == supportedLocale);
    } catch {
      return false;
    }
  }

  setCurrentLocale(locale) {
    this.intl.setLocale(locale);
    this.dayjs.setLocale(locale);

    // metricsService may not be available for the different front apps
    const metricsService = getOwner(this).lookup('service:metrics');
    if (metricsService) {
      metricsService.context.locale = locale;
    }
  }

  detectBestLocale({ language, user }) {
    if (this.currentDomain.isFranceDomain) {
      this.setCurrentLocale(FRENCH_INTERNATIONAL_LOCALE);
      this.#setLocaleCookie(FRENCH_FRANCE_LOCALE);
      return;
    }

    if (language) {
      const supportedLanguage = this.#findSupportedLanguage(language);
      this.setCurrentLocale(supportedLanguage);
      return;
    }

    if (user?.lang) {
      const supportedLanguage = this.#findSupportedLanguage(user.lang);
      this.setCurrentLocale(supportedLanguage);
      return;
    }

    this.setCurrentLocale(DEFAULT_LOCALE);
  }

  #findSupportedLanguage(language) {
    return this.pixLanguages.filter((pixLanguage) => this.supportedLocales.includes(pixLanguage)).includes(language)
      ? language
      : DEFAULT_LOCALE;
  }

  #setLocaleCookie(locale) {
    const cookie = this.cookies.exists('locale');
    if (cookie) return;

    this.cookies.write('locale', locale, {
      domain: `pix.${this.currentDomain.getExtension()}`,
      maxAge: COOKIE_LOCALE_LIFESPAN_IN_SECONDS,
      path: '/',
      sameSite: 'Strict',
    });
  }
}
