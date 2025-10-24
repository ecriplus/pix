import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixInputPassword from '@1024pix/pix-ui/components/pix-input-password';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import ENV from 'pix-orga/config/environment';
import { FormValidation } from 'pix-orga/utils/form-validation';

import isEmailValid from '../../utils/email-validator';

const VALIDATION_ERRORS = {
  login: 'pages.login-form.errors.empty-email',
  password: 'pages.login-form.errors.empty-password',
};

class NewLoginForm extends Component {
  @service currentDomain;
  @service url;
  @service intl;
  @service locale;
  @service session;
  @service store;

  @tracked globalError = null;
  @tracked isLoading = false;
  @tracked password = '';
  @tracked login = '';

  validation = new FormValidation({
    login: {
      validate: (value) => Boolean(value),
      error: VALIDATION_ERRORS.login,
    },
    password: {
      validate: (value) => Boolean(value),
      error: VALIDATION_ERRORS.password,
    },
  });

  get displayRecoveryLink() {
    if (!this.currentDomain.isFranceDomain) return false;
    return !this.args.isWithInvitation;
  }

  @action
  async authenticate(event) {
    if (event) event.preventDefault();

    try {
      this.globalError = null;
      this.isLoading = true;

      const formValues = { login: this.login, password: this.password };
      const isValid = this.validation.validateAll(formValues);
      if (!isValid) return;

      const login = this.login.trim();

      if (this.args.isWithInvitation) {
        try {
          await this._acceptOrganizationInvitation(
            this.args.organizationInvitationId,
            this.args.organizationInvitationCode,
            login,
          );
        } catch (err) {
          const error = err.errors[0];
          const isInvitationAlreadyAcceptedByAnotherUser = error.status === '409';
          if (isInvitationAlreadyAcceptedByAnotherUser) {
            this.globalError = this.intl.t('pages.login-form.errors.status.409');
            this.isLoading = false;
            return;
          }
          const isUserAlreadyOrganizationMember = error.status === '412';
          if (!isUserAlreadyOrganizationMember) {
            this.globalError = this.intl.t(this._getI18nKeyByStatus(+error.status));
            this.isLoading = false;
            return;
          }
        }
      }

      await this.session.authenticate('authenticator:oauth2', login, this.password);
    } catch (responseError) {
      this._handleApiError(responseError);
    } finally {
      this.isLoading = false;
    }
  }

  get pixAppForgottenPasswordUrlWithEmail() {
    const url = new URL(this.url.pixAppForgottenPasswordUrl);
    if (this.login) url.searchParams.set('email', this.login);
    return url.toString();
  }

  @action
  updatePassword(event) {
    this.password = event.target.value?.trim();
    this.validation.password.validate(this.password);
  }

  @action
  updateLogin(event) {
    this.login = event.target.value?.trim();
    this.validation.login.validate(this.login);
  }

  async _acceptOrganizationInvitation(organizationInvitationId, organizationInvitationCode, email) {
    const type = 'organization-invitation-response';
    const id = `${organizationInvitationId}_${organizationInvitationCode}`;
    const organizationInvitationRecord = this.store.peekRecord(type, id);

    if (!organizationInvitationRecord) {
      let record;
      try {
        record = this.store.createRecord(type, { id, code: organizationInvitationCode, email });
        await record.save({ adapterOptions: { organizationInvitationId } });
      } catch (error) {
        record.deleteRecord();
        throw error;
      }
    }
  }

  _handleApiError(responseError) {
    const errors = responseError?.responseJSON?.errors;
    const error = Array.isArray(errors) && errors.length > 0 && errors[0];
    switch (error?.code) {
      case 'SHOULD_CHANGE_PASSWORD':
        this.globalError = this.intl.t(ENV.APP.API_ERROR_MESSAGES.SHOULD_CHANGE_PASSWORD.I18N_KEY, {
          url: this.url.pixAppForgottenPasswordUrl,
          htmlSafe: true,
        });
        break;
      case 'USER_IS_TEMPORARY_BLOCKED':
        this.globalError = this.intl.t(ENV.APP.API_ERROR_MESSAGES.USER_IS_TEMPORARY_BLOCKED.I18N_KEY, {
          url: this.url.pixAppForgottenPasswordUrl,
          htmlSafe: true,
        });
        break;
      case 'USER_IS_BLOCKED':
        this.globalError = this.intl.t(ENV.APP.API_ERROR_MESSAGES.USER_IS_BLOCKED.I18N_KEY, {
          url: 'https://support.pix.org/support/tickets/new',
          htmlSafe: true,
        });
        break;
      default:
        this.globalError = this.intl.t(this._getI18nKeyByStatus(responseError.status));
    }
  }

  _getI18nKeyByStatus(status) {
    switch (status) {
      case 400:
        return ENV.APP.API_ERROR_MESSAGES.BAD_REQUEST.I18N_KEY;
      case 401:
        return ENV.APP.API_ERROR_MESSAGES.LOGIN_UNAUTHORIZED.I18N_KEY;
      // TODO: This case should be handled with a specific error code like USER_IS_TEMPORARY_BLOCKED or USER_IS_BLOCKED
      case 403:
        return ENV.APP.API_ERROR_MESSAGES.NOT_LINKED_ORGANIZATION.I18N_KEY;
      case 422:
        return ENV.APP.API_ERROR_MESSAGES.BAD_REQUEST.I18N_KEY;
      case 504:
        return ENV.APP.API_ERROR_MESSAGES.GATEWAY_TIMEOUT.I18N_KEY;
      default:
        return ENV.APP.API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR.I18N_KEY;
    }
  }

  <template>
    <form class="authentication-login-form" {{on "submit" this.authenticate}}>
      {{#if @hasInvitationAlreadyBeenAccepted}}
        <PixNotificationAlert @type="error" role="alert">
          {{t "pages.login-form.invitation-already-accepted"}}
        </PixNotificationAlert>
      {{/if}}

      {{#if @isInvitationCancelled}}
        <PixNotificationAlert @type="error" role="alert">
          {{t "pages.login-form.invitation-was-cancelled"}}
        </PixNotificationAlert>
      {{/if}}

      {{#if this.globalError}}
        <PixNotificationAlert @type="error" role="alert">
          {{this.globalError}}
        </PixNotificationAlert>
      {{/if}}

      <p class="authentication-login-form__mandatory-fields-message">
        {{t "common.form.mandatory-all-fields"}}
      </p>

      <PixInput
        @id="login-email"
        name="login"
        {{on "input" this.updateLogin}}
        @value={{this.login}}
        type="email"
        placeholder={{t "pages.login-form.email.placeholder"}}
        @validationStatus={{this.validation.login.status}}
        @errorMessage={{t this.validation.login.error}}
        autocomplete="email"
        aria-required="true"
      >
        <:label>{{t "pages.login-form.email.label"}}</:label>
      </PixInput>

      <div class="authentication-login-form__password">
        <PixInputPassword
          @id="login-password"
          name="password"
          {{on "input" this.updatePassword}}
          @value={{this.password}}
          @validationStatus={{this.validation.password.status}}
          @errorMessage={{t this.validation.password.error}}
          autocomplete="current-password"
          aria-required={{true}}
        >
          <:label>{{t "pages.login-form.password"}}</:label>
        </PixInputPassword>
        <a
          class="link link--grey link--underlined pix-body-s"
          href="{{this.pixAppForgottenPasswordUrlWithEmail}}"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{t "pages.login-form.forgot-password"}}
        </a>
      </div>

      <PixButton @type="submit" @isLoading={{this.isLoading}}>
        {{t "pages.login-form.login"}}
      </PixButton>

      {{#if this.displayRecoveryLink}}
        <div class="authentication-login-form__recover-access">
          <p class="authentication-login-form__recover-access__question">
            {{t "pages.login-form.admin-role-question"}}
          </p>
          <LinkTo class="link link--black link--underlined" @route="join-request">
            {{t "pages.login-form.active-or-retrieve"}}
          </LinkTo>
          <div class="authentication-login-form__recover-access__message">
            ({{t "pages.login-form.only-for-admin"}})
          </div>
        </div>
      {{/if}}
    </form>
  </template>
}

class LegacyLoginForm extends Component {
  @service currentDomain;
  @service url;
  @service intl;
  @service locale;
  @service session;
  @service store;

  @tracked errorMessage = null;
  @tracked isLoading = false;
  @tracked password = '';
  @tracked email = '';
  @tracked passwordValidationMessage = null;
  @tracked emailValidationMessage = null;

  get displayRecoveryLink() {
    if (!this.currentDomain.isFranceDomain) return false;
    return !this.args.isWithInvitation;
  }

  @action
  async authenticate(event) {
    event.preventDefault();

    this.isLoading = true;
    const email = this.email ? this.email.trim() : '';
    const password = this.password;

    if (!this.isFormValid) {
      this.isLoading = false;
      return;
    }

    if (this.args.isWithInvitation) {
      try {
        await this._acceptOrganizationInvitation(
          this.args.organizationInvitationId,
          this.args.organizationInvitationCode,
          email,
        );
      } catch (err) {
        const error = err.errors[0];
        const isInvitationAlreadyAcceptedByAnotherUser = error.status === '409';
        if (isInvitationAlreadyAcceptedByAnotherUser) {
          this.errorMessage = this.intl.t('pages.login-form.errors.status.409');
          this.isLoading = false;
          return;
        }
        const isUserAlreadyOrganizationMember = error.status === '412';
        if (!isUserAlreadyOrganizationMember) {
          this.errorMessage = this.intl.t(this._getI18nKeyByStatus(+error.status));
          this.isLoading = false;
          return;
        }
      }
    }

    return this._authenticate(password, email);
  }

  @action
  validatePassword(event) {
    this.password = event.target.value ?? '';
    const isInvalidInput = this.password === '';
    this.passwordValidationMessage = null;

    if (isInvalidInput) {
      this.passwordValidationMessage = this.intl.t('pages.login-form.errors.empty-password');
    }
  }

  @action
  validateEmail(event) {
    this.email = event.target.value?.trim();
    const isInvalidInput = !isEmailValid(this.email);

    this.emailValidationMessage = null;

    if (isInvalidInput) {
      this.emailValidationMessage = this.intl.t('pages.login-form.errors.invalid-email');
    }
  }

  @action
  updateEmail(event) {
    this.email = event.target.value?.trim() ?? '';
  }

  get isFormValid() {
    return isEmailValid(this.email) && this.password !== '';
  }

  async _authenticate(password, email) {
    this.errorMessage = null;
    try {
      await this.session.authenticate('authenticator:oauth2', email, password);
    } catch (responseError) {
      this._handleApiError(responseError);
    } finally {
      this.isLoading = false;
    }
  }

  async _acceptOrganizationInvitation(organizationInvitationId, organizationInvitationCode, email) {
    const type = 'organization-invitation-response';
    const id = `${organizationInvitationId}_${organizationInvitationCode}`;
    const organizationInvitationRecord = this.store.peekRecord(type, id);

    if (!organizationInvitationRecord) {
      let record;
      try {
        record = this.store.createRecord(type, { id, code: organizationInvitationCode, email });
        await record.save({ adapterOptions: { organizationInvitationId } });
      } catch (error) {
        record.deleteRecord();
        throw error;
      }
    }
  }

  _handleApiError(responseError) {
    const errors = responseError?.responseJSON?.errors;
    const error = Array.isArray(errors) && errors.length > 0 && errors[0];
    switch (error?.code) {
      case 'SHOULD_CHANGE_PASSWORD':
        this.errorMessage = this.intl.t(ENV.APP.API_ERROR_MESSAGES.SHOULD_CHANGE_PASSWORD.I18N_KEY, {
          url: this.url.pixAppForgottenPasswordUrl,
          htmlSafe: true,
        });
        break;
      case 'USER_IS_TEMPORARY_BLOCKED':
        this.errorMessage = this.intl.t(ENV.APP.API_ERROR_MESSAGES.USER_IS_TEMPORARY_BLOCKED.I18N_KEY, {
          url: this.url.pixAppForgottenPasswordUrl,
          htmlSafe: true,
        });
        break;
      case 'USER_IS_BLOCKED':
        this.errorMessage = this.intl.t(ENV.APP.API_ERROR_MESSAGES.USER_IS_BLOCKED.I18N_KEY, {
          url: 'https://support.pix.org/support/tickets/new',
          htmlSafe: true,
        });
        break;
      default:
        this.errorMessage = this.intl.t(this._getI18nKeyByStatus(responseError.status));
    }
  }

  _getI18nKeyByStatus(status) {
    switch (status) {
      case 400:
        return ENV.APP.API_ERROR_MESSAGES.BAD_REQUEST.I18N_KEY;
      case 401:
        return ENV.APP.API_ERROR_MESSAGES.LOGIN_UNAUTHORIZED.I18N_KEY;
      // TODO: This case should be handled with a specific error code like USER_IS_TEMPORARY_BLOCKED or USER_IS_BLOCKED
      case 403:
        return ENV.APP.API_ERROR_MESSAGES.NOT_LINKED_ORGANIZATION.I18N_KEY;
      case 404:
        return ENV.APP.API_ERROR_MESSAGES.USER_NOT_FOUND.I18N_KEY;
      case 422:
        return ENV.APP.API_ERROR_MESSAGES.BAD_REQUEST.I18N_KEY;
      case 504:
        return ENV.APP.API_ERROR_MESSAGES.GATEWAY_TIMEOUT.I18N_KEY;
      default:
        return ENV.APP.API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR.I18N_KEY;
    }
  }

  <template>
    <div class="login-form-legacy-design">

      {{#unless @isWithInvitation}}
        <p class="login-form-legacy-design__information">{{t "pages.login-form.is-only-accessible"}}</p>
      {{/unless}}

      {{#if @hasInvitationAlreadyBeenAccepted}}
        <p class="login-form-legacy-design__invitation-error">{{t "pages.login-form.invitation-already-accepted"}}</p>
      {{/if}}

      {{#if @isInvitationCancelled}}
        <p class="login-form-legacy-design__invitation-error">{{t "pages.login-form.invitation-was-cancelled"}}</p>
      {{/if}}

      {{#if this.errorMessage}}
        <p id="login-form-error-message" class="login-form-legacy-design__error-message" role="alert">
          {{this.errorMessage}}
        </p>
      {{/if}}

      <form class="login-form-legacy-design__input-container" {{on "submit" this.authenticate}}>
        <p class="login-form-legacy-design__mandatory-information">{{t "common.form.mandatory-all-fields"}}</p>

        <PixInput
          @id="login-email"
          name="login"
          type="email"
          {{on "focusout" this.validateEmail}}
          {{on "input" this.updateEmail}}
          @errorMessage={{this.emailValidationMessage}}
          @validationStatus={{if this.emailValidationMessage "error" "default"}}
          required={{true}}
          aria-required="true"
          autocomplete="email"
        >
          <:label>{{t "pages.login-form.email.label"}}</:label>
        </PixInput>

        <PixInputPassword
          @id="login-password"
          name="password"
          autocomplete="current-password"
          required={{true}}
          aria-required={{true}}
          {{on "focusout" this.validatePassword}}
          {{on "input" this.validatePassword}}
          @errorMessage={{this.passwordValidationMessage}}
          @validationStatus={{if this.passwordValidationMessage "error" "default"}}
        >
          <:label>{{t "pages.login-form.password"}}</:label>
        </PixInputPassword>

        <PixButton @type="submit" @isLoading={{this.isLoading}}>
          {{t "pages.login-form.login"}}
        </PixButton>

        <div class="login-form-legacy-design__forgotten-password">
          <a href="{{this.url.pixAppForgottenPasswordUrl}}" target="_blank" rel="noopener noreferrer">
            {{t "pages.login-form.forgot-password"}}
          </a>
        </div>

        {{#if this.displayRecoveryLink}}
          <div>
            <div class="login-form-legacy-design__recover-access-link help-text">
              <LinkTo @route="join-request" class="link">
                {{t "pages.login-form.admin-role-question"}}
                {{t "pages.login-form.active-or-retrieve"}}</LinkTo>
            </div>
            <div class="login-form-legacy-design__recover-access-message help-text">({{t
                "pages.login-form.only-for-admin"
              }})</div>
          </div>
        {{/if}}

      </form>
    </div>
  </template>
}

export default class LoginForm extends Component {
  @service featureToggles;

  get isNewAuthDesignEnabled() {
    return this.featureToggles.featureToggles.usePixOrgaNewAuthDesign;
  }

  <template>
    {{#if this.isNewAuthDesignEnabled}}
      <NewLoginForm
        @isWithInvitation={{@isWithInvitation}}
        @organizationInvitationId={{@organizationInvitationId}}
        @organizationInvitationCode={{@organizationInvitationCode}}
        @hasInvitationAlreadyBeenAccepted={{@hasInvitationAlreadyBeenAccepted}}
        @isInvitationCancelled={{@isInvitationCancelled}}
      />
    {{else}}
      <LegacyLoginForm
        @isWithInvitation={{@isWithInvitation}}
        @organizationInvitationId={{@organizationInvitationId}}
        @organizationInvitationCode={{@organizationInvitationCode}}
        @hasInvitationAlreadyBeenAccepted={{@hasInvitationAlreadyBeenAccepted}}
        @isInvitationCancelled={{@isInvitationCancelled}}
      />
    {{/if}}
  </template>
}
