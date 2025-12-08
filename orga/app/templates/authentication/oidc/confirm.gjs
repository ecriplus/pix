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
        @identityProviderOrganizationName={{@model.identityProviderOrganizationName}}
        @authenticationMethods={{@model.authenticationMethods}}
        @fullNameFromPix={{@model.fullNameFromPix}}
        @fullNameFromExternalIdentityProvider={{@model.fullNameFromExternalIdentityProvider}}
        @email={{@model.email}}
      />
    </:content>
  </AuthenticationLayout>
</template>
