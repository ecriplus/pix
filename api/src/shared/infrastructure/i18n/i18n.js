import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { I18n } from 'i18n';
import merge from 'lodash/merge.js';

import { getDefaultLocale, getNearestSupportedLocale } from '../../../shared/domain/services/locale-service.js';
import { config } from '../../config.js';
import { logger } from '../utils/logger.js';
import { getChallengeLocale } from '../utils/request-response-utils.js';

const __dirname = import.meta.dirname;
const translationsFolder = path.resolve(path.join(__dirname, '../../../../translations'));

export async function buildStaticCatalog(baseFolder, overrideFolders) {
  const files = (await readdir(baseFolder)).filter((f) => f.endsWith('.json'));
  const catalog = {};

  for (const file of files) {
    const locale = file.replace('.json', '');
    const base = JSON.parse(await readFile(path.join(baseFolder, file), 'utf-8'));

    let merged = base;
    for (const folder of overrideFolders) {
      try {
        const override = JSON.parse(await readFile(path.join(folder, file), 'utf-8'));
        merged = merge(merged, override);
      } catch {
        // file doesn't exist in this override folder, skip
      }
    }

    catalog[locale] = merged;
  }

  return catalog;
}

const _buildDefaultSettings = async () => {
  const base = {
    locales: ['de-AT', 'en', 'fr', 'es', 'es-419', 'nl', 'it'],
    fallbacks: { 'de-*': 'de', 'en-*': 'en', 'fr-*': 'fr', 'es-*': 'es', 'nl-*': 'nl', 'it-*': 'it' },
    defaultLocale: 'fr', // default locale must match an existing translation file (fr => fr.json)
    directory: translationsFolder,
    objectNotation: true,
    updateFiles: false,
    mustacheConfig: {
      tags: ['{', '}'],
      disable: false,
    },
  };

  const overrideFolders = config.i18n.translationsFolders;
  if (overrideFolders.length > 0) {
    base.staticCatalog = await buildStaticCatalog(translationsFolder, overrideFolders);
  }

  return base;
};

export const defaultSettings = await _buildDefaultSettings();

// This is an optimization to avoid settings a new instance each time
// we need to use i18n.
const i18nInstances = {};

/**
 * @param {string} locale a locale (language or BCP 47 format)
 * @returns i18n instance correctly setup with the language
 */
export function getI18n(locale, settings = defaultSettings) {
  const nearestLocale = getNearestSupportedLocale(locale) || getDefaultLocale();

  if (!i18nInstances[nearestLocale]) {
    const i18n = new I18n(settings);
    i18n.setLocale(nearestLocale);
    // we freeze the setLocale to avoid changing i18n locale for an instance
    i18n.setLocale = () => {
      logger.warn('Cannot change i18n locale instance, use getI18n(locale) instead.');
    };
    const originalI18nTranslate = i18n.__;
    i18n.__ = (param1, param2) => {
      if (_isTranslationKeyOnly(param1, param2)) {
        return originalI18nTranslate({ phrase: param1, locale: nearestLocale });
      }

      if (_hasTranslationParameter(param1, param2)) {
        return originalI18nTranslate({ phrase: param1, locale: nearestLocale }, param2);
      }

      return originalI18nTranslate(param1, param2);
    };

    i18nInstances[nearestLocale] = i18n;
  }

  return i18nInstances[nearestLocale];
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
