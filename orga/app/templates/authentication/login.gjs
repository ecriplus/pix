import { LinkTo } from '@ember/routing';
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

      <LoginForm @onSubmit={{@controller.authenticate}} @errorMessage={{@controller.errorMessage}} />

      <AuthenticationIdentityProviders />

      {{#if @controller.displayRecoveryLink}}
        <div class="authentication-login__recover-access">
          <p class="authentication-login__recover-access__question">
            {{t "pages.login-form.admin-role-question"}}
          </p>
          <LinkTo class="link link--black link--underlined" @route="join-request">
            {{t "pages.login-form.active-or-retrieve"}}
          </LinkTo>
          <div class="authentication-login__recover-access__message">
            ({{t "pages.login-form.only-for-admin"}})
          </div>
        </div>
      {{/if}}

    </:content>
  </AuthenticationLayout>
</template>
