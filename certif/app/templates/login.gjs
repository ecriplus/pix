import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import LocaleSwitcher from 'pix-certif/components/locale-switcher';
import Login from 'pix-certif/components/login/index';

<template>
  {{pageTitle (t 'pages.login.title')}}
  <main class='login-page'>
    <div>
      <Login
        @hasInvitationAlreadyBeenAccepted={{@controller.hasInvitationAlreadyBeenAccepted}}
        @isInvitationCancelled={{@controller.isInvitationCancelled}}
      />

      {{#if @controller.isInternationalDomain}}
        <LocaleSwitcher />
      {{/if}}
    </div>
  </main>
</template>
