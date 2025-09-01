import accept from '@hapi/accept';

import {
  getChallengeLocales,
  getDefaultChallengeLocale,
  getDefaultLocale,
  getNearestChallengeLocale,
  getNearestSupportedLocale,
} from '../../../shared/domain/services/locale-service.js';
import { tokenService } from '../../../shared/domain/services/token-service.js';
import { featureToggles } from '../feature-toggles/index.js';

const acceptedLanguages = getChallengeLocales();
const defaultChallengeLocale = getDefaultChallengeLocale();

function extractTLDFromRequest(request) {
  const forwardedHost = request.headers['x-forwarded-host'];
  if (forwardedHost.includes('.fr')) return 'fr';
  if (forwardedHost.includes('.org')) return 'org';
  return null;
}

function escapeFileName(fileName) {
  return fileName
    .normalize('NFD')
    .toLowerCase()
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^_. a-z0-9-]/g, '')
    .trim()
    .replace(/ /g, '_');
}

/**
 * @deprecated Instead, for authenticated routes, use `const { userId } = request.auth.credentials.userId`
 */
function extractUserIdFromRequest(request) {
  if (request.headers && request.headers.authorization) {
    const token = tokenService.extractTokenFromAuthChain(request.headers.authorization);
    return tokenService.extractUserId(token);
  }
  return null;
}

/**
 * Returns the locale for the user request. (ie. fr-FR, fr-BE, nl...)
 * Determined from the query params locale or lang, from the `locale` cookie.
 * When no locale found, return the default one.
 *
 * @param {*} request - http request
 * @returns {string} - supported locale (ie. fr-FR, fr-BE, nl...)
 */
function getUserLocale(request = {}) {
  const locale = request.query?.locale || request.query?.lang || request.state?.locale;
  if (locale) {
    return getNearestSupportedLocale(locale);
  }

  return getDefaultLocale();
}

/**
 * Returns a challenge locale for the user request. (ie. fr-fr, fr, nl...)
 * Determined from the query params locale or lang, from the `locale` cookie.
 * When no locale found, return the default challenge locale.
 *
 * @param {*} request - http request
 * @returns {Promise<string>} - locale of a challenge (ie. fr-fr, fr, nl...)
 */
async function getChallengeLocale(request) {
  const useCookieLocaleInApi = await featureToggles.get('useCookieLocaleInApi');

  if (!useCookieLocaleInApi) return _getLegacyChallengeLocale(request);

  const locale = request.query?.locale || request.query?.lang || request.state?.locale;

  return getNearestChallengeLocale(locale);
}

function _getLegacyChallengeLocale(request) {
  const languageHeader = request.headers && request.headers['accept-language'];
  if (!languageHeader) {
    return defaultChallengeLocale;
  }

  return accept.language(languageHeader, acceptedLanguages) || defaultChallengeLocale;
}

function extractTimestampFromRequest(request) {
  return request.info.received;
}

export {
  escapeFileName,
  extractTimestampFromRequest,
  extractTLDFromRequest,
  extractUserIdFromRequest,
  getChallengeLocale,
  getUserLocale,
};
