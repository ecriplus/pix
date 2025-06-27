import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import OtherAuthenticationProviders from 'mon-pix/components/authentication/other-authentication-providers';
import SignupForm from 'mon-pix/components/authentication/signup-form/index';
import AuthenticationLayout from 'mon-pix/components/authentication-layout/index';

<template>
  {{pageTitle (t "pages.sign-up.title")}}

  <AuthenticationLayout class="signup-page-layout">

    <:header>
      {{#unless @model.isAnonymous}}
        <PixButtonLink @variant="secondary" @route="authentication.login">
          {{t "pages.sign-up.actions.login"}}
        </PixButtonLink>
      {{/unless}}
    </:header>

    <:content>
      <h1 class="pix-title-m">{{t "pages.sign-up.first-title"}}</h1>
      <SignupForm @user={{@model}} />
      <OtherAuthenticationProviders @isForSignup={{true}} />
    </:content>
  </AuthenticationLayout>
</template>
