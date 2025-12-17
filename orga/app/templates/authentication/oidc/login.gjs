import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import LoginForm from 'pix-orga/components/authentication/login-form';
import AuthenticationLayout from 'pix-orga/components/authentication-layout/index';

<template>
  {{pageTitle (t "pages.login.title")}}

  <AuthenticationLayout class="signin-page-layout">
    <:header>
    </:header>

    <:content>
      {{#if @controller.currentInvitation}}
        <PixNotificationAlert @type="communication-orga">
          {{t "pages.login.join-invitation" organizationName=@controller.currentInvitation.organizationName}}
        </PixNotificationAlert>
      {{/if}}

      <div>
        <h1 class="pix-title-m">{{t "pages.oidc.login.title"}}</h1>
        <h3 class="pix-body-l">{{t "pages.oidc.login.sub-title"}}</h3>
      </div>

      <LoginForm
        @isWithInvitation={{@controller.isWithInvitation}}
        @hasInvitationAlreadyBeenAccepted={{@controller.hasInvitationAlreadyBeenAccepted}}
        @isInvitationCancelled={{@controller.isInvitationCancelled}}
        @onSubmit={{@controller.redirectToAssociationConfirmation}}
      />
    </:content>
  </AuthenticationLayout>
</template>
