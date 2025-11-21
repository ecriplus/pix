import PixButton from '@1024pix/pix-ui/components/pix-button';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import OidcProviderSelector from './oidc-provider-selector';

export default class SsoSelectionForm extends Component {
  @service router;
  @service oidcIdentityProviders;

  @tracked selectedProviderSlug = null;

  @action
  async onProviderChange(selectedProviderSlug) {
    this.selectedProviderSlug = selectedProviderSlug;
  }

  get hasSelectedProvider() {
    return this.selectedProviderSlug !== null;
  }

  get selectedProviderName() {
    const provider = this.oidcIdentityProviders.findBySlug(this.selectedProviderSlug);
    if (!provider) return null;
    return provider.organizationName;
  }

  @action
  goToOidcProviderLoginPage() {
    this.oidcIdentityProviders.isOidcProviderAuthenticationInProgress = true;
    this.router.transitionTo('authentication.login-oidc', this.selectedProviderSlug);
  }

  <template>
    <section class="sso-selection-form">
      <h2 class="pix-title-s">
        {{t "pages.sso-selection.title"}}
      </h2>

      <p class="sso-selection-form__mandatory-fields-message">
        {{t "common.form.mandatory-all-fields"}}
      </p>

      <OidcProviderSelector
        @providers={{this.oidcIdentityProviders.list}}
        @onProviderChange={{this.onProviderChange}}
      />

      {{#if this.hasSelectedProvider}}
        <PixButton
          @triggerAction={{this.goToOidcProviderLoginPage}}
          @isLoading={{this.oidcIdentityProviders.isOidcProviderAuthenticationInProgress}}
          aria-describedby="login-message"
        >
          {{#if @isForSignup}}
            {{t "pages.sso-selection.signup.button"}}
          {{else}}
            {{t "pages.sso-selection.login.button"}}
          {{/if}}
        </PixButton>

        <p id="login-message" class="sso-selection-form__login-message" aria-live="polite">
          {{t "pages.sso-selection.login.message" providerName=this.selectedProviderName}}
        </p>
      {{else}}
        <PixButton @type="button" @isDisabled={{true}}>
          {{#if @isForSignup}}
            {{t "pages.sso-selection.signup.button"}}
          {{else}}
            {{t "pages.sso-selection.login.button"}}
          {{/if}}
        </PixButton>
      {{/if}}
    </section>
  </template>
}
