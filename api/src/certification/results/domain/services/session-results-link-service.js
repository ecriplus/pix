import { tokenService } from '../../../../shared/domain/services/token-service.js';
import { getPixAppUrl } from '../../../../shared/domain/services/url-service.js';

export const generateResultsLink = function ({ sessionId, i18n }) {
  const token = tokenService.createCertificationResultsLinkToken({ sessionId });
  const locale = i18n.getLocale();
  return getPixAppUrl(locale, {
    pathname: '/resultats-session',
    hash: token,
  });
};
