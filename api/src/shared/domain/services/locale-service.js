const ENGLISH_SPOKEN = 'en';
const FRENCH_FRANCE = 'fr-fr';
const FRENCH_SPOKEN = 'fr';
const DUTCH_SPOKEN = 'nl';
const SPANISH_SPOKEN = 'es';

const CHALLENGE_LOCALES = ['en', 'fr', 'fr-fr', 'nl', 'es', 'it', 'de'];

const DEFAULT_CHALLENGE_LOCALE = 'fr-fr';

const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'nl', 'fr-BE', 'fr-FR', 'nl-BE'];

const SUPPORTED_LANGUAGES = Array.from(new Set(SUPPORTED_LOCALES.map((locale) => new Intl.Locale(locale).language)));

const DEFAULT_LOCALE = 'fr';

/**
 * Returns all locales available in challenges of the Pix platform
 */
function getChallengeLocales() {
  return CHALLENGE_LOCALES;
}

function getDefaultChallengeLocale() {
  return DEFAULT_CHALLENGE_LOCALE;
}

function getSupportedLocales() {
  return SUPPORTED_LOCALES;
}

/**
 * @deprecated use getSupportedLocales or getChallengeLocales instead whenever possible.
 */
function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES;
}

function getDefaultLocale() {
  return DEFAULT_LOCALE;
}

/**
 * Returns the given language if the language is supported, otherwise returns the default locale.
 * @deprecated will soon be removed
 */
function coerceLanguage(language) {
  if (SUPPORTED_LANGUAGES.includes(language)) {
    return language;
  }

  return DEFAULT_LOCALE;
}

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

export {
  coerceLanguage,
  DUTCH_SPOKEN,
  ENGLISH_SPOKEN,
  FRENCH_FRANCE,
  FRENCH_SPOKEN,
  getChallengeLocales,
  getDefaultChallengeLocale,
  getDefaultLocale,
  getNearestSupportedLocale,
  getSupportedLanguages,
  getSupportedLocales,
  SPANISH_SPOKEN,
};
