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
import get from 'lodash/get';
import { FormValidation } from 'pix-orga/utils/form-validation';

const VALIDATION_ERRORS = {
  login: 'pages.login-form.errors.empty-email',
  password: 'pages.login-form.errors.empty-password',
};

export default class LoginForm extends Component {
  @service currentDomain;
  @service url;
  @service intl;
  @service authErrorMessages;

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
  async submit(event) {
    if (event) event.preventDefault();

    try {
      this.globalError = null;
      this.isLoading = true;

      const formValues = { login: this.login, password: this.password };
      const isValid = this.validation.validateAll(formValues);
      if (!isValid) return;

      const login = this.login.trim();

      await this.args.onSubmit(login, this.password);
    } catch (error) {
      // Handling error for those different cases: EmberSimpleAuth, JSON:API response, non-JSON:API response
      const extractedError = get(error, error.responseJSON ? 'responseJSON.errors[0]' : 'errors[0]') ?? error;

      // TODO: should be managed with a code instead of status only
      const isInvitationAlreadyAcceptedByAnotherUser = extractedError.status === '409';
      if (isInvitationAlreadyAcceptedByAnotherUser) {
        this.globalError = this.intl.t('pages.login-form.errors.status.409');
      } else {
        this.globalError = this.authErrorMessages.getAuthenticationErrorMessage(extractedError);
      }
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

  <template>
    <form class="authentication-login-form" {{on "submit" this.submit}}>
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
