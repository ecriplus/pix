import dayjs from 'dayjs';

import * as translations from '../../../../../translations/index.js';
import { tokenService } from '../../../../shared/domain/services/token-service.js';
import { getPixAppUrl, getPixWebsiteDomain, getPixWebsiteUrl } from '../../../../shared/domain/services/url-service.js';
import { mailer } from '../../../../shared/mail/infrastructure/services/mailer.js';

const EMAIL_ADDRESS_NO_RESPONSE = 'ne-pas-repondre@pix.fr';

function sendNotificationToCertificationCenterRefererForCleaResults({ email, sessionId, sessionDate }) {
  const formattedSessionDate = dayjs(sessionDate).locale('fr').format('DD/MM/YYYY');

  const options = {
    from: EMAIL_ADDRESS_NO_RESPONSE,
    fromName: translations.fr['email-sender-name']['pix-app'],
    to: email,
    template: mailer.acquiredCleaResultTemplateId,
    variables: { sessionId, sessionDate: formattedSessionDate },
  };

  return mailer.sendEmail(options);
}

function sendCertificationResultEmail({
  email,
  sessionId,
  sessionDate,
  certificationCenterName,
  resultRecipientEmail,
  daysBeforeExpiration,
  translate,
}) {
  const token = tokenService.createCertificationResultsByRecipientEmailLinkToken({
    sessionId,
    resultRecipientEmail,
    daysBeforeExpiration,
  });
  const formattedSessionDate = dayjs(sessionDate).locale('fr').format('DD/MM/YYYY');

  const templateVariables = {
    certificationCenterName,
    sessionId,
    sessionDate: formattedSessionDate,
    fr: {
      ...translations.fr['certification-result-email'].params,
      homeName: getPixWebsiteDomain('fr-FR'),
      homeUrl: getPixWebsiteUrl('fr-FR'),
      homeNameInternational: getPixWebsiteDomain('fr'),
      homeUrlInternational: getPixWebsiteUrl('fr'),
      title: translate({ phrase: 'certification-result-email.title', locale: 'fr' }, { sessionId }),
      link: getPixAppUrl('fr', { pathname: `/api/sessions/download-results/${token}` }),
    },
    en: {
      ...translations.en['certification-result-email'].params,
      homeName: getPixWebsiteDomain('en'),
      homeUrl: getPixWebsiteUrl('en'),
      title: translate({ phrase: 'certification-result-email.title', locale: 'en' }, { sessionId }),
      link: getPixAppUrl('en', { pathname: `/api/sessions/download-results/${token}` }),
    },
  };

  return mailer.sendEmail({
    from: EMAIL_ADDRESS_NO_RESPONSE,
    fromName: `${translations.fr['email-sender-name']['pix-app']} / ${translations.en['email-sender-name']['pix-app']}`,
    to: email,
    template: mailer.certificationResultTemplateId,
    variables: templateVariables,
  });
}

const mailService = {
  sendNotificationToCertificationCenterRefererForCleaResults,
  sendCertificationResultEmail,
};

/**
 * @typedef {Object} MailService
 * @property {function} sendCertificationResultEmail
 * @property {function} sendNotificationToCertificationCenterRefererForCleaResults
 */
export { mailService, sendCertificationResultEmail, sendNotificationToCertificationCenterRefererForCleaResults };
