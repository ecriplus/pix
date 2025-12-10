import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AuthenticationIdentityProviders from 'pix-orga/components/authentication/authentication-identity-providers';
import LoginForm from 'pix-orga/components/authentication/login-form';
import AuthenticationLayout from 'pix-orga/components/authentication-layout/index';

<template>
  {{pageTitle (t "pages.login.title")}}

  <AuthenticationLayout class="signin-page-layout">
    <:header>
    </:header>

    <:content>
      <div>
        <h1 class="pix-title-m">{{t "pages.login.title"}}</h1>
        <h3 class="pix-body-l">{{t "pages.login.with-pix-account"}}</h3>
      </div>

      <LoginForm
        @isWithInvitation={{false}}
        @hasInvitationAlreadyBeenAccepted={{@controller.hasInvitationAlreadyBeenAccepted}}
        @isInvitationCancelled={{@controller.isInvitationCancelled}}
        @onSubmit={{@controller.authenticate}}
      />

      <AuthenticationIdentityProviders />
    </:content>
  </AuthenticationLayout>
</template>
