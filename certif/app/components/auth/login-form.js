import { action } from '@ember/object';
import isEmpty from 'lodash/isEmpty';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import isEmailValid from '../../utils/email-validator';

export default class LoginForm extends Component {
  @service intl;
  @service url;
  @service store;
  @service session;

  @tracked errorMessage = null;
  @tracked isErrorMessagePresent = false;
  @tracked isLoading = false;
  @tracked password = null;
  @tracked email = null;
  @tracked passwordValidationMessage = null;
  @tracked emailValidationMessage = null;

  @action
  async authenticate(event) {
    event.preventDefault();
    this.isLoading = true;
    this.isErrorMessagePresent = false;
    this.errorMessage = '';
    this._initErrorMessages();

    const email = this.email;
    const password = this.password;

    if (!this.isFormValid) {
      this.isLoading = false;
      return;
    }

    if (this.args.isWithInvitation) {
      try {
        await this.args.certificationCenterInvitation.accept({
          id: this.args.certificationCenterInvitationId,
          code: this.args.certificationCenterInvitationCode,
          email,
        });
        return this._authenticate(password, email);
      } catch (errorResponse) {
        errorResponse.errors.forEach((error) => {
          const invitationIsAlreadyAccepted = error.status === '412';
          if (!invitationIsAlreadyAccepted) {
            this.errorMessage = this._handleResponseError(errorResponse);
            this.isErrorMessagePresent = true;
          }
        });
      }
    }
  }

  async _authenticate(password, email) {
    const scope = 'pix-certif';

    try {
      await this.session.authenticate('authenticator:oauth2', email, password, scope);
    } catch (errorResponse) {
      // TODO
    } finally {
      this.isLoading = false;
    }
  }

  @action
  validatePassword(event) {
    this.password = event.target.value;
    const isInvalidInput = isEmpty(this.password);
    this.passwordValidationMessage = null;

    if (isInvalidInput) {
      this.passwordValidationMessage = this.intl.t('pages.login-or-register.login-form.fields.password.error');
    }
  }

  @action
  validateEmail(event) {
    this.email = event.target.value?.trim();
    const isInvalidInput = !isEmailValid(this.email);

    this.emailValidationMessage = null;

    if (isInvalidInput) {
      this.emailValidationMessage = this.intl.t('pages.login-or-register.login-form.fields.email.error');
    }
  }

  @action
  updateEmail(event) {
    this.email = event.target.value?.trim();
  }

  get isFormValid() {
    return isEmailValid(this.email) && !isEmpty(this.password);
  }

  get forgottenPasswordUrl() {
    return this.url.forgottenPasswordUrl;
  }

  _initErrorMessages() {
    this.ERROR_MESSAGES = {
      DEFAULT: this.intl.t('common.api-errors-messages.default'),
      STATUS_400: this.intl.t('api-errors-messages.bad-request'),
      STATUS_403: this.intl.t('pages.login-or-register.login-form.errors.status.403'),
      STATUS_412: this.intl.t('pages.login-or-register.login-form.errors.status.412'),
    };
  }

  _handleResponseError(errorResponse) {
    if (Array.isArray(errorResponse?.errors)) {
      const error = errorResponse?.errors[0];

      switch (error.status) {
        case '400':
          return this.ERROR_MESSAGES.STATUS_400;
        case '401':
          return this.ERROR_MESSAGES.STATUS_401;
        case '403':
          return this.ERROR_MESSAGES.STATUS_403;
        case '412':
          return this.ERROR_MESSAGES.STATUS_412;
        default:
          return this.ERROR_MESSAGES.DEFAULT;
      }
    } else {
      return this.ERROR_MESSAGES.DEFAULT;
    }
  }
}
