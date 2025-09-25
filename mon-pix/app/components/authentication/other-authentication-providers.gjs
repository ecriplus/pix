import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class OtherAuthenticationProviders extends Component {
  @service oidcIdentityProviders;
  @service router;

  constructor() {
    super(...arguments);

    // This happens if the user goes backward after being redirected to the authentication page of
    // an OIDC Provider and we don't want the isLoading of the OIDC authentication button to still
    // be active, so that the user can use the button again.
    addEventListener('pageshow', () => {
      this.oidcIdentityProviders.isOidcProviderAuthenticationInProgress = false;
    });
  }

  get ssoSelectionRoute() {
    const { isForSignup } = this.args;
    return isForSignup ? 'inscription.sso-selection' : 'authentication.sso-selection';
  }

  @action
  goToOidcProviderLoginPage() {
    this.oidcIdentityProviders.isOidcProviderAuthenticationInProgress = true;
    this.router.transitionTo('authentication.login-oidc', this.oidcIdentityProviders.featuredIdentityProvider.slug);
  }

  <template>
    {{#if this.oidcIdentityProviders.hasIdentityProviders}}
      <section class="authentication-other-authentication-providers-section">
        <h2 class="authentication-other-authentication-providers-section__heading">
          {{#if @isForSignup}}
            {{t "components.authentication.other-authentication-providers.signup.heading"}}
          {{else}}
            {{t "components.authentication.other-authentication-providers.login.heading"}}
          {{/if}}
        </h2>

        {{#if this.oidcIdentityProviders.featuredIdentityProvider}}
          <PixButton
            @triggerAction={{this.goToOidcProviderLoginPage}}
            @isLoading={{this.oidcIdentityProviders.isOidcProviderAuthenticationInProgress}}
            @variant="secondary"
            @loadingColor="grey"
            class="authentication-other-authentication-providers-section__button"
          >
            <img
              src="/images/logo/identity-providers/{{this.oidcIdentityProviders.featuredIdentityProvider.slug}}.svg"
              alt=""
              class="authentication-other-authentication-providers-section__featured-identity-provider-logo"
            />
            {{#if @isForSignup}}
              {{t
                "components.authentication.other-authentication-providers.signup.signup-with-featured-identity-provider-link"
                featuredIdentityProvider=this.oidcIdentityProviders.featuredIdentityProvider.organizationName
              }}
            {{else}}
              {{t
                "components.authentication.other-authentication-providers.login.login-with-featured-identity-provider-link"
                featuredIdentityProvider=this.oidcIdentityProviders.featuredIdentityProvider.organizationName
              }}
            {{/if}}
          </PixButton>
        {{/if}}

        {{#if this.oidcIdentityProviders.hasOtherIdentityProviders}}
          <PixButtonLink
            @route={{this.ssoSelectionRoute}}
            @isDisabled={{this.oidcIdentityProviders.isOidcProviderAuthenticationInProgress}}
            @variant="secondary"
            class="authentication-other-authentication-providers-section__button-link"
          >
            {{t "components.authentication.other-authentication-providers.select-another-organization-link"}}

            <span class="authentication-other-authentication-providers-section__chevron-right"></span>
          </PixButtonLink>
        {{/if}}
      </section>
    {{/if}}
  </template>
}
