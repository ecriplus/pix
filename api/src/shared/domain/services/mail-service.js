import * as translations from '../../../../translations/index.js';
import { mailer } from '../../mail/infrastructure/services/mailer.js';
import {
  DUTCH_SPOKEN,
  ENGLISH_SPOKEN,
  FRENCH_FRANCE,
  FRENCH_SPOKEN,
  isFranceLocale,
  SPANISH_SPOKEN,
} from '../services/locale-service.js';
import {
  getPixAppUrl,
  getPixCertifUrl,
  getPixOrgaUrl,
  getPixWebsiteDomain,
  getPixWebsiteUrl,
  getSupportUrl,
} from './url-service.js';

const EMAIL_ADDRESS_NO_RESPONSE = 'ne-pas-repondre@pix.fr';
const EMAIL_VERIFICATION_CODE_TAG = 'EMAIL_VERIFICATION_CODE';
const SCO_ACCOUNT_RECOVERY_TAG = 'SCO_ACCOUNT_RECOVERY';

/**
 * @param email
 * @param organizationName
 * @param organizationInvitationId
 * @param code
 * @param locale
 * @param tags
 * @returns {Promise<EmailingAttempt>}
 */
function sendOrganizationInvitationEmail({
  email,
  organizationName,
  organizationInvitationId,
  code,
  locale = FRENCH_FRANCE,
  tags,
}) {
  const mailerConfig = _getMailerTranslation(locale);

  const pixOrgaName = mailerConfig.translation['email-sender-name']['pix-orga'];
  const sendOrganizationInvitationEmailSubject = mailerConfig.translation['organization-invitation-email'].subject;

  const templateVariables = {
    organizationName,
    pixHomeName: getPixWebsiteDomain(locale),
    pixHomeUrl: getPixWebsiteUrl(locale),
    pixOrgaHomeUrl: getPixOrgaUrl(locale),
    redirectionUrl: getPixOrgaUrl(locale, {
      pathname: '/rejoindre',
      queryParams: { invitationId: organizationInvitationId, code },
    }),
    supportUrl: getSupportUrl(locale),
    ...mailerConfig.translation['organization-invitation-email'].params,
  };

  return mailer.sendEmail({
    from: EMAIL_ADDRESS_NO_RESPONSE,
    fromName: pixOrgaName,
    to: email,
    subject: sendOrganizationInvitationEmailSubject,
    template: mailer.organizationInvitationTemplateId,
    variables: templateVariables,
    tags: tags || null,
  });
}

/**
 * @param email
 * @param organizationName
 * @param firstName
 * @param lastName
 * @param organizationInvitationId
 * @param code
 * @param locale
 * @param tags
 * @returns {Promise<EmailingAttempt>}
 */
function sendScoOrganizationInvitationEmail({
  email,
  organizationName,
  firstName,
  lastName,
  organizationInvitationId,
  code,
  locale = FRENCH_FRANCE,
  tags,
}) {
  const mailerConfig = _getMailerTranslation(locale);

  const templateVariables = {
    organizationName,
    firstName,
    lastName,
    pixHomeName: getPixWebsiteDomain(locale),
    pixHomeUrl: getPixWebsiteUrl(locale),
    pixOrgaHomeUrl: getPixOrgaUrl(locale),
    redirectionUrl: getPixOrgaUrl(locale, {
      pathname: '/rejoindre',
      queryParams: { invitationId: organizationInvitationId, code },
    }),
  };

  return mailer.sendEmail({
    from: EMAIL_ADDRESS_NO_RESPONSE,
    fromName: mailerConfig.translation['email-sender-name']['pix-orga'],
    to: email,
    subject: 'Accès à votre espace Pix Orga',
    template: mailer.organizationInvitationScoTemplateId,
    variables: templateVariables,
    tags: tags || null,
  });
}

/**
 * @param email
 * @param certificationCenterName
 * @param certificationCenterInvitationId
 * @param code
 * @param locale
 * @returns {Promise<EmailingAttempt>}
 */
function sendCertificationCenterInvitationEmail({
  email,
  certificationCenterName,
  certificationCenterInvitationId,
  code,
  locale = FRENCH_FRANCE,
}) {
  const mailerConfig = _getMailerTranslation(locale);

  const subject = mailerConfig.translation['certification-center-invitation-email'].subject;
  const fromName = mailerConfig.translation['email-sender-name']['pix-certif'];
  const templateVariables = {
    certificationCenterName,
    pixHomeName: getPixWebsiteDomain(locale),
    pixHomeUrl: getPixWebsiteUrl(locale),
    pixCertifHomeUrl: getPixCertifUrl(locale),
    redirectionUrl: getPixCertifUrl(locale, {
      pathname: '/rejoindre',
      queryParams: { invitationId: certificationCenterInvitationId, code },
    }),
    supportUrl: getSupportUrl(locale),
    ...mailerConfig.translation['certification-center-invitation-email'].params,
  };

  return mailer.sendEmail({
    subject,
    from: EMAIL_ADDRESS_NO_RESPONSE,
    fromName,
    to: email,
    template: mailer.certificationCenterInvitationTemplateId,
    variables: templateVariables,
  });
}

/**
 * @param email
 * @param firstName
 * @param temporaryKey
 * @returns {Promise<EmailingAttempt>}
 */
function sendAccountRecoveryEmail({ email, firstName, temporaryKey }) {
  const mailerConfig = _getMailerTranslation(FRENCH_FRANCE);
  const fromName = mailerConfig.translation['email-sender-name']['pix-app'];
  const redirectionUrl = getPixAppUrl(FRENCH_FRANCE, { pathname: `/recuperer-mon-compte/${temporaryKey}` });
  const templateVariables = {
    firstName,
    redirectionUrl,
    homeName: getPixWebsiteDomain(FRENCH_FRANCE),
    ...mailerConfig.translation['account-recovery-email'].params,
  };

  return mailer.sendEmail({
    from: EMAIL_ADDRESS_NO_RESPONSE,
    fromName,
    to: email,
    subject: 'Récupération de votre compte Pix',
    template: mailer.accountRecoveryTemplateId,
    tags: [SCO_ACCOUNT_RECOVERY_TAG],
    variables: templateVariables,
  });
}

/**
 * @param code
 * @param email
 * @param locale
 * @param translate
 * @returns {Promise<EmailingAttempt>}
 */
function sendVerificationCodeEmail({ code, email, locale = FRENCH_FRANCE, translate }) {
  const mailerConfig = _getMailerTranslation(locale);

  const options = {
    from: EMAIL_ADDRESS_NO_RESPONSE,
    fromName: mailerConfig.translation['email-sender-name']['pix-app'],
    to: email,
    template: mailer.emailVerificationCodeTemplateId,
    tags: [EMAIL_VERIFICATION_CODE_TAG],
    subject: translate(
      {
        phrase: 'verification-code-email.subject',
        locale: locale === FRENCH_FRANCE ? 'fr' : locale,
      },
      { code },
    ),
    variables: {
      code,
      homeName: getPixWebsiteDomain(locale),
      homeUrl: getPixWebsiteUrl(locale),
      displayNationalLogo: isFranceLocale(locale),
      ...mailerConfig.translation['verification-code-email'].body,
    },
  };

  return mailer.sendEmail(options);
}

function sendCpfEmail({ email, generatedFiles }) {
  const options = {
    from: EMAIL_ADDRESS_NO_RESPONSE,
    fromName: translations.fr['email-sender-name']['pix-app'],
    to: email,
    template: mailer.cpfEmailTemplateId,
    variables: { generatedFiles },
  };

  return mailer.sendEmail(options);
}

/**
 * @typedef {Object} mailerConfig
 * @property {JSON} translation
 */

/**
 * @param locale
 * @returns {mailerConfig}
 * @private
 */
function _getMailerTranslation(locale) {
  switch (locale) {
    case FRENCH_SPOKEN:
    case SPANISH_SPOKEN:
    case ENGLISH_SPOKEN:
    case DUTCH_SPOKEN:
      return {
        translation: translations[locale],
      };
    default:
      return {
        translation: translations.fr,
      };
  }
}

const mailService = {
  sendAccountRecoveryEmail,
  sendOrganizationInvitationEmail,
  sendScoOrganizationInvitationEmail,
  sendCertificationCenterInvitationEmail,
  sendVerificationCodeEmail,
  sendCpfEmail,
};

/**
 * @typedef {Object} MailService
 * @property {function} sendAccountRecoveryEmail
 * @property {function} sendCertificationCenterInvitationEmail
 * @property {function} sendCpfEmail
 * @property {function} sendOrganizationInvitationEmail
 * @property {function} sendScoOrganizationInvitationEmail
 * @property {function} sendVerificationCodeEmail
 */
export {
  mailService,
  sendAccountRecoveryEmail,
  sendCertificationCenterInvitationEmail,
  sendCpfEmail,
  sendOrganizationInvitationEmail,
  sendScoOrganizationInvitationEmail,
  sendVerificationCodeEmail,
};
