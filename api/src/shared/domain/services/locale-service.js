const ENGLISH_SPOKEN = 'en';
const FRENCH_FRANCE = 'fr-fr';
const FRENCH_SPOKEN = 'fr';
const DUTCH_SPOKEN = 'nl';
const SPANISH_SPOKEN = 'es';
const FRENCH_FRANCE_LOCALE = 'fr-FR';

const DEFAULT_CHALLENGE_LOCALE = 'fr-fr';
const CHALLENGE_LOCALES = ['en', 'fr', 'fr-fr', 'nl', 'es', 'es-419', 'it', 'de'];

const DEFAULT_LOCALE = 'fr';
const SUPPORTED_LOCALES = ['en', 'es', 'es-419', 'fr', 'nl', 'fr-BE', 'fr-FR', 'nl-BE'];

const SUPPORTED_LANGUAGES = Array.from(new Set(SUPPORTED_LOCALES.map((locale) => new Intl.Locale(locale).language)));

/**
 * @returns {string[]} - all locales available in challenges of the Pix platform
 */
function getChallengeLocales() {
  return CHALLENGE_LOCALES;
}

/**
 * @returns {string} - the default locale for challenges
 */
function getDefaultChallengeLocale() {
  return DEFAULT_CHALLENGE_LOCALE;
}

/**
 * @returns {string[]} - all supported locales by the Pix platform
 */
function getSupportedLocales() {
  return SUPPORTED_LOCALES;
}

/**
 * @deprecated use getSupportedLocales or getChallengeLocales instead whenever possible
 * @returns {string[]} - all supported languages by the Pix platform
 */
function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES;
}

/**
 * @returns {string} - the default locale for the Pix platform
 */
function getDefaultLocale() {
  return DEFAULT_LOCALE;
}

/**
 * @deprecated will soon be removed
 * @returns {string} - the given language if the language is supported, otherwise returns the default locale
 */
function coerceLanguage(language) {
  if (SUPPORTED_LANGUAGES.includes(language)) {
    return language;
  }
  return DEFAULT_LOCALE;
}

/**
 * @returns {string} - the nearest supported locale by Pix platform according the given locale
 */
function getNearestSupportedLocale(locale) {
  if (!locale) return undefined;
  try {
    const intlLocale = new Intl.Locale(locale);

    if (SUPPORTED_LOCALES.includes(intlLocale.toString())) {
      return intlLocale.toString();
    }

    const localeMatch = SUPPORTED_LOCALES.find((l) => new Intl.Locale(l).language === intlLocale.language);
    if (localeMatch) return localeMatch;

    return DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

/**
 * @returns {string} - the base locale (ex: 'fr', 'en'...) according the given locale (ex: 'fr-FR', 'en-GB')
 */
function getBaseLocale(locale) {
  try {
    return new Intl.Locale(locale).language;
  } catch {
    return new Intl.Locale(DEFAULT_LOCALE).language;
  }
}

/**
 * @returns {boolean} - returns true when locale from France (ex: fr-fr or fr-FR), otherwise false
 */
function isFranceLocale(locale) {
  const supportedLocale = getNearestSupportedLocale(locale) || DEFAULT_LOCALE;
  return supportedLocale === FRENCH_FRANCE_LOCALE;
}

/**
 * @param {string} locale
 * @returns {string} - returns the nearest challenge locale according to the given locale
 */
function getNearestChallengeLocale(locale) {
  if (!locale) {
    return getDefaultChallengeLocale();
  }

  try {
    const intlLocale = new Intl.Locale(locale);

    if (intlLocale.toString() === FRENCH_FRANCE_LOCALE) {
      return FRENCH_FRANCE;
    }

    if (CHALLENGE_LOCALES.includes(intlLocale.toString())) {
      return intlLocale.toString();
    }

    const localeMatch = CHALLENGE_LOCALES.find((l) => new Intl.Locale(l).language === intlLocale.language);
    if (localeMatch) return localeMatch;

    return DEFAULT_CHALLENGE_LOCALE;
  } catch {
    return DEFAULT_CHALLENGE_LOCALE;
  }
}

export {
  coerceLanguage,
  DUTCH_SPOKEN,
  ENGLISH_SPOKEN,
  FRENCH_FRANCE,
  FRENCH_SPOKEN,
  getBaseLocale,
  getChallengeLocales,
  getDefaultChallengeLocale,
  getDefaultLocale,
  getNearestChallengeLocale,
  getNearestSupportedLocale,
  getSupportedLanguages,
  getSupportedLocales,
  isFranceLocale,
  SPANISH_SPOKEN,
};
