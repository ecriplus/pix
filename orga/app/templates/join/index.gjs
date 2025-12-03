import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AuthenticationIdentityProviders from 'pix-orga/components/authentication/authentication-identity-providers';
import LoginForm from 'pix-orga/components/authentication/login-form';
import AuthenticationLayout from 'pix-orga/components/authentication-layout/index';

<template>
  {{pageTitle (t "pages.login-or-register.title" organizationName=@model.organizationName)}}

  <AuthenticationLayout class="signin-page-layout">
    <:header>
      <PixButtonLink @variant="secondary" @route="join.signup" @query={{@controller.routeQueryParams}}>
        {{t "pages.login.signup.label"}}
      </PixButtonLink>
    </:header>

    <:content>
      <PixNotificationAlert @type="communication-orga">
        {{t "pages.login.join-invitation" organizationName=@model.organizationName}}
      </PixNotificationAlert>

      <div>
        <h1 class="pix-title-m">{{t "pages.login.title"}}</h1>
        <h2 class="pix-body-l">{{t "pages.login.with-pix-account"}}</h2>
      </div>

      <LoginForm
        @isWithInvitation={{true}}
        @hasInvitationAlreadyBeenAccepted={{@controller.hasInvitationAlreadyBeenAccepted}}
        @isInvitationCancelled={{@controller.isInvitationCancelled}}
        @organizationInvitationId={{@controller.invitationId}}
        @organizationInvitationCode={{@controller.code}}
        @organizationName={{@model.organizationName}}
      />

      <AuthenticationIdentityProviders
        @invitationId={{@controller.invitationId}}
        @invitationCode={{@controller.code}}
      />
    </:content>
  </AuthenticationLayout>
</template>
