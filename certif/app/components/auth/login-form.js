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

    this._initErrorMessages();

    const email = this.email;
    const password = this.password;

    if (!this.isFormValid) {
      this.isLoading = false;
      return;
    }

    if (this.args.isWithInvitation) {
      this.isErrorMessagePresent = false;
      this.errorMessage = '';

      console.log('this.errorMessage', this.errorMessage);
      console.log('this.isErrorMessagePresent', this.isErrorMessagePresent);

      try {
        await this.args.certificationCenterInvitation.accept({
          id: this.args.certificationCenterInvitationId,
          code: this.args.certificationCenterInvitationCode,
          email,
        });
        return this._authenticate(password, email);
      } catch (errorResponse) {
        errorResponse.errors.forEach((error) => {
          const invitationIsAlreadyAcceptedOrUserIsAlreadyMember = error.status === '412';
          if (invitationIsAlreadyAcceptedOrUserIsAlreadyMember) {
            return this._authenticate(password, email);
          }
          this.errorMessage = this._handleResponseError(errorResponse);
          this.isErrorMessagePresent = true;
          this.isLoading = false;
        });
      }
    }
  }

  async _authenticate(password, email) {
    const scope = 'pix-certif';
    this.isErrorMessagePresent = false;
    this.errorMessage = '';
    try {
      // Remarque, si user connecté, pb, l'utilisateur n'est pas redirigé vers la page d'accueil
      // http://localhost:4203/sessions/liste
      await this.session.authenticate('authenticator:oauth2', email, password, scope);
    } catch (errorResponse) {
      this.errorMessage = this._handleResponseError(errorResponse);
      this.isErrorMessagePresent = true;
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
      STATUS_400: this.intl.t('common.api-errors-messages.bad-request'),
      STATUS_401: this.intl.t('pages.login-or-register.login-form.errors.status.401'),
      STATUS_403: this.intl.t('pages.login-or-register.login-form.errors.status.403'),
      STATUS_404: 'Utilisateur non existant',
      STATUS_409: "L'invitation a déjà été acceptée ou annulée.",
      STATUS_412: this.intl.t('pages.login-or-register.login-form.errors.status.412'),
      // 429
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
        case '404':
          return this.ERROR_MESSAGES.STATUS_404;
        case '409':
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
