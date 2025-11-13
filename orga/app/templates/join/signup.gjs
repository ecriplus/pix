import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AuthenticationLayout from 'pix-orga/components/authentication-layout/index';

import SignupForm from '../../components/authentication/signup-form/index';

<template>
  {{pageTitle (t "pages.login-or-register.title" organizationName=@model.organizationName)}}

  <AuthenticationLayout class="signin-page-layout">
    <:header>
      <PixButtonLink @variant="secondary" @route="join" @query={{@controller.routeQueryParams}}>
        {{t "pages.login-or-register.login-form.button"}}
      </PixButtonLink>
    </:header>

    <:content>
      <PixNotificationAlert @type="communication-orga">
        {{t "pages.login.join-invitation" organizationName=@model.organizationName}}
      </PixNotificationAlert>

      <div>
        <h1 class="pix-title-m">{{t "pages.join.signup.title"}}</h1>
        <h3 class="pix-body-l">{{t "pages.join.signup.subtitle"}}</h3>
      </div>

      <SignupForm
        @organizationInvitationId={{@controller.invitationId}}
        @organizationInvitationCode={{@controller.code}}
      />

    </:content>
  </AuthenticationLayout>
</template>
