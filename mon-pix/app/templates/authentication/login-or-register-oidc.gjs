import PixBackgroundHeader from '@1024pix/pix-ui/components/pix-background-header';
import PixBlock from '@1024pix/pix-ui/components/pix-block';
import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import LoginOrRegisterOidc from 'mon-pix/components/authentication/login-or-register-oidc';
import OidcReconciliation from 'mon-pix/components/authentication/oidc-reconciliation';
import LocaleSwitcher from 'mon-pix/components/locale-switcher';

<template>
  {{pageTitle (t "pages.login-or-register-oidc.title")}}

  <PixBackgroundHeader>
    <PixBlock @shadow="light" class="login-or-register-oidc-form">
      <a href={{@controller.showcase.url}} class="login-or-register-oidc-form__logo">
        <img src="/images/pix-logo.svg" alt="{{@controller.showcase.linkText}}" />
      </a>

      {{#if @controller.showOidcReconciliation}}
        <OidcReconciliation
          @identityProviderSlug={{@controller.identityProviderSlug}}
          @authenticationKey={{@controller.authenticationKey}}
          @email={{@controller.email}}
          @username={{@controller.username}}
          @fullNameFromPix={{@controller.fullNameFromPix}}
          @fullNameFromExternalIdentityProvider={{@controller.fullNameFromExternalIdentityProvider}}
          @authenticationMethods={{@controller.authenticationMethods}}
          @toggleOidcReconciliation={{@controller.toggleOidcReconciliation}}
        />
      {{else}}
        <LoginOrRegisterOidc
          @identityProviderSlug={{@controller.identityProviderSlug}}
          @authenticationKey={{@controller.authenticationKey}}
          @userClaims={{@controller.userClaims}}
          @onLogin={{@controller.onLogin}}
        />
      {{/if}}

    </PixBlock>

    {{#if @controller.isInternationalDomain}}
      <LocaleSwitcher />
    {{/if}}
  </PixBackgroundHeader>
</template>
