import path from 'node:path';

import { I18n } from 'i18n';

import {
  getBaseLocale,
  getDefaultLocale,
  getNearestSupportedLocale,
} from '../../../shared/domain/services/locale-service.js';
import { logger } from '../utils/logger.js';
import { getChallengeLocale } from '../utils/request-response-utils.js';

const __dirname = import.meta.dirname;
const translationsFolder = path.resolve(path.join(__dirname, '../../../../translations'));

export const options = {
  locales: ['en', 'fr', 'es', 'es-419', 'nl'],
  fallbacks: { 'en-*': 'en', 'fr-*': 'fr', 'es-*': 'es', 'nl-*': 'nl' },
  defaultLocale: 'fr', // default locale must match an existing translation file (fr => fr.json)
  directory: translationsFolder,
  objectNotation: true,
  updateFiles: false,
  mustacheConfig: {
    tags: ['{', '}'],
    disable: false,
  },
};

// This is an optimization to avoid settings a new instance each time
// we need to use i18n.
const i18nInstances = {};

/**
 * @param {string} locale a locale (language or BCP 47 format)
 * @returns i18n instance correctly setup with the language
 */
export function getI18n(locale) {
  const supportedLocale = getNearestSupportedLocale(locale) || getDefaultLocale();
  const baseLocale = getBaseLocale(supportedLocale);

  if (!i18nInstances[baseLocale]) {
    const i18n = new I18n(options);
    i18n.setLocale(baseLocale);
    // we freeze the setLocale to avoid changing i18n locale for an instance
    i18n.setLocale = () => {
      logger.warn('Cannot change i18n locale instance, use getI18n(locale) instead.');
    };
    const originalI18nTranslate = i18n.__;
    i18n.__ = (param1, param2) => {
      if (_isTranslationKeyOnly(param1, param2)) {
        return originalI18nTranslate({ phrase: param1, locale: baseLocale });
      }

      if (_hasTranslationParameter(param1, param2)) {
        return originalI18nTranslate({ phrase: param1, locale: baseLocale }, param2);
      }

      return originalI18nTranslate(param1, param2);
    };

    i18nInstances[baseLocale] = i18n;
  }

  return i18nInstances[baseLocale];
}

/**
 * @deprecated prefer usage of getI18n(locale) when needed.
 * @param {*} request HAPI request
 * @returns the i18n instance according the locale extracted from the request
 */
export function getI18nFromRequest(request) {
  const locale = request.query?.lang || getChallengeLocale(request);
  return getI18n(locale);
}

function _isTranslationKeyOnly(translationKey, translationParameter) {
  return typeof translationKey === 'string' && translationParameter === undefined;
}

function _hasTranslationParameter(translationKey, translationParameter) {
  return typeof translationKey === 'string' && translationParameter !== undefined;
}
