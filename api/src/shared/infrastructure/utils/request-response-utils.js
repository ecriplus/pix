import accept from '@hapi/accept';

import {
  getChallengeLocales,
  getDefaultChallengeLocale,
  getDefaultLocale,
  getNearestSupportedLocale,
} from '../../../shared/domain/services/locale-service.js';
import { tokenService } from '../../../shared/domain/services/token-service.js';

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

function extractUserIdFromRequest(request) {
  if (request.headers && request.headers.authorization) {
    const token = tokenService.extractTokenFromAuthChain(request.headers.authorization);
    return tokenService.extractUserId(token);
  }
  return null;
}

function getUserLocale(request = {}) {
  const locale = request.query?.locale || request.query?.lang || request.state?.locale;
  if (locale) {
    return getNearestSupportedLocale(locale, acceptedLanguages);
  }

  return getDefaultLocale();
}

function getChallengeLocale(request) {
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
