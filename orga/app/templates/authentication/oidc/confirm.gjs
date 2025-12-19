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
        @identityProviderSlug={{@model.identityProviderSlug}}
        @authenticationMethods={{@model.authenticationMethods}}
        @fullNameFromPix={{@model.fullNameFromPix}}
        @fullNameFromExternalIdentityProvider={{@model.fullNameFromExternalIdentityProvider}}
        @email={{@model.email}}
        @invitationId={{@model.invitationId}}
        @invitationCode={{@model.invitationCode}}
        @authenticationKey={{@model.authenticationKey}}
      />
    </:content>
  </AuthenticationLayout>
</template>
