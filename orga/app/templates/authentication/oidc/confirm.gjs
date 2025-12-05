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
        @identityProviderSlug="pro-connect"
        @authenticationMethods="email"
        @fullNameFromPix="John Doe"
        @fullNameFromExternalIdentityProvider="John Arthur Doe"
        @email="john@example.net"
      />
    </:content>
  </AuthenticationLayout>
</template>
