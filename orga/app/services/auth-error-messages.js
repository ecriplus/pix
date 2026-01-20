import Service, { service } from '@ember/service';
import get from 'lodash/get';

const DEFAULT_MESSAGE = { i18nKey: 'common.api-error-messages.default' };

const AUTHENTICATION_DEFAULT_MESSAGE = {
  i18nKey: 'common.api-error-messages.login-unexpected-error',
  getOptions: (_error, { url }) => ({ supportHomeUrl: url.supportHomeUrl, htmlSafe: true }),
};

const HTTP_STATUS_MAPPING = {
  400: { i18nKey: 'common.api-error-messages.bad-request-error' },
  401: { i18nKey: 'common.api-error-messages.login-unauthorized-error' },
  409: { i18nKey: 'common.api-error-messages.account-conflict' },
  422: { i18nKey: 'common.api-error-messages.bad-request-error' },
  504: { i18nKey: 'common.api-error-messages.internal-server-error' },
};

const AUTHENTICATION_ERROR_CODES_MAPPING = {
  EXPIRED_AUTHENTICATION_KEY: {
    i18nKey: 'common.api-error-messages.expired-authentication-key',
  },
  USER_IS_TEMPORARY_BLOCKED: {
    getI18nKey: (error) => {
      if (error.meta?.isLoginFailureWithUsername) {
        return 'common.api-error-messages.login-user-temporary-blocked-with-username-error';
      }
      return 'common.api-error-messages.login-user-temporary-blocked-error';
    },
    getOptions: (error) => ({
      url: '/mot-de-passe-oublie',
      blockingDurationMinutes: error.meta?.blockingDurationMs / 1000 / 60,
      htmlSafe: true,
    }),
  },
  USER_IS_BLOCKED: {
    i18nKey: 'common.api-error-messages.login-user-blocked-error',
    getOptions: (_error) => ({
      url: 'https://support.pix.org/support/tickets/new',
      htmlSafe: true,
    }),
  },
  MISSING_OR_INVALID_CREDENTIALS: {
    getI18nKey: (error) => {
      if (error.meta?.isLoginFailureWithUsername) {
        if (error.meta?.remainingAttempts > 0) {
          return 'common.api-error-messages.login-unauthorized-remaining-attempts-with-user-name-error';
        }
        return 'common.api-error-messages.login-unauthorized-with-user-name-error';
      }

      if (error.meta?.remainingAttempts > 0) {
        return 'common.api-error-messages.login-unauthorized-remaining-attempts-error';
      }
      return 'common.api-error-messages.login-unauthorized-error';
    },
    getOptions: (error) => ({ remainingAttempts: error.meta?.remainingAttempts, htmlSafe: true }),
  },
  PIX_ORGA_ACCESS_NOT_ALLOWED: {
    i18nKey: 'pages.login-form.errors.access-not-allowed',
  },
  USER_HAS_NO_ORGANIZATION_MEMBERSHIP: {
    i18nKey: 'pages.login-form.errors.access-not-allowed',
  },
  INVITATION_CANCELLED: {
    i18nKey: 'pages.login-form.invitation-was-cancelled',
  },
  INVITATION_ALREADY_ACCEPTED: {
    i18nKey: 'pages.login-form.invitation-already-accepted',
  },
  INVITATION_NOT_FOUND: {
    i18nKey: 'pages.login-form.invitation-not-found',
  },
  INVITATION_INVALID: {
    i18nKey: 'pages.login-form.errors.status.409',
  },
};

export default class AuthErrorMessagesService extends Service {
  @service intl;
  @service url;

  getHttpErrorMessage(originalError, defaultMessage = DEFAULT_MESSAGE) {
    const error = get(originalError, 'errors[0]') || originalError;

    const message = HTTP_STATUS_MAPPING[error?.status];

    return this.#formatError(error, message || defaultMessage);
  }

  getAuthenticationErrorMessage(originalError) {
    const error = get(originalError, 'errors[0]') || originalError;
    const message = AUTHENTICATION_ERROR_CODES_MAPPING[error?.code];
    if (!message) {
      return this.getHttpErrorMessage(originalError, AUTHENTICATION_DEFAULT_MESSAGE);
    }

    return this.#formatError(error, message);
  }

  #formatError(error, message) {
    const { i18nKey, getI18nKey, getOptions } = message;
    const options = getOptions ? getOptions(error, { url: this.url }) : {};

    if (getI18nKey) {
      return this.intl.t(getI18nKey(error), options);
    }

    return this.intl.t(i18nKey, options);
  }
}
