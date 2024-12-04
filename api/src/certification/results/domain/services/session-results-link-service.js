import { config } from '../../../../shared/config.js';
import { tokenService } from '../../../../shared/domain/services/token-service.js';

const generateResultsLink = function ({ sessionId, i18n }) {
  const daysBeforeExpiration = 30;

  const token = tokenService.createCertificationResultsLinkToken({ sessionId, daysBeforeExpiration });
  const lang = i18n.getLocale();
  const link = `${config.domain.pixApp + config.domain.tldOrg}/resultats-session#${token}?lang=${lang}`;

  return link;
};

export { generateResultsLink };
