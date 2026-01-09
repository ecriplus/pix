import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AuthenticationLayout from 'pix-orga/components/authentication-layout/index';

import OidcAssociationConfirmation from '../../../components/authentication/oidc-association-confirmation';

<template>
  {{pageTitle (t "pages.login.title")}}

  <AuthenticationLayout class="signin-page-layout">
    <:header>
    </:header>

    <:content>
      <OidcAssociationConfirmation
        @onSubmit={{@controller.joinAndLinkAccount}}
        @identityProviderSlug={{@model.identity_provider_slug}}
        @identityProviderName={{@controller.identityProviderName}}
        @oidcAuthenticationMethodNames={{@controller.oidcAuthenticationMethodNames}}
        @email={{@controller.email}}
        @fullNameFromPix={{@controller.fullNameFromPix}}
        @fullNameFromExternalIdentityProvider={{@controller.fullNameFromExternalIdentityProvider}}
      />
    </:content>
  </AuthenticationLayout>
</template>
