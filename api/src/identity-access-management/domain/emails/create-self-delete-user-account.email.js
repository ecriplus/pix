import { EmailFactory } from '../../../shared/mail/domain/models/EmailFactory.js';
import { mailer } from '../../../shared/mail/infrastructure/services/mailer.js';

/**
 * Creates an email for self-deleting a user account.
 *
 * @param {Object} params - The parameters for creating the email.
 * @param {string} params.locale - The locale for the email.
 * @param {string} params.email - The recipient's email address.
 * @param {string} params.firstName - The recipient's first name.
 * @returns {Object} The email object.
 */
export function createSelfDeleteUserAccountEmail({ locale, email, firstName }) {
  const factory = new EmailFactory({ app: 'pix-app', locale });

  const { i18n, defaultVariables } = factory;

  return factory.buildEmail({
    template: mailer.selfAccountDeletionTemplateId,
    subject: i18n.__('self-account-deletion-email.subject'),
    to: email,
    variables: {
      homeName: defaultVariables.homeName,
      homeUrl: defaultVariables.homeUrl,
      helpdeskUrl: defaultVariables.helpdeskUrl,
      displayNationalLogo: defaultVariables.displayNationalLogo,
      doNotAnswer: i18n.__('common.email.doNotAnswer'),
      moreOn: i18n.__('common.email.moreOn'),
      pixPresentation: i18n.__('common.email.pixPresentation'),
      title: i18n.__('self-account-deletion-email.params.title'),
      hello: i18n.__('self-account-deletion-email.params.hello', { firstName }),
      requestConfirmation: i18n.__('self-account-deletion-email.params.requestConfirmation'),
      seeYouSoon: i18n.__('self-account-deletion-email.params.seeYouSoon'),
      signing: i18n.__('self-account-deletion-email.params.signing'),
      warning: i18n.__('self-account-deletion-email.params.warning'),
    },
  });
}
