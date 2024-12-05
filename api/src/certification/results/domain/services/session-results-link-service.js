import { config } from '../../../../shared/config.js';
import { tokenService } from '../../../../shared/domain/services/token-service.js';

export const generateResultsLink = function ({ sessionId, i18n }) {
  const token = tokenService.createCertificationResultsLinkToken({ sessionId });
  const lang = i18n.getLocale();
  return `${config.domain.pixApp + config.domain.tldOrg}/resultats-session?lang=${lang}#${token}`;
};
