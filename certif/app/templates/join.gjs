import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import LoginOrRegister from 'pix-certif/components/auth/login-or-register';

<template>
  {{pageTitle (t 'pages.login-or-register.title' certificationCenterName=@model.certificationCenterName)}}

  <div class='join-page'>
    <LoginOrRegister
      @certificationCenterInvitationId={{@controller.invitationId}}
      @certificationCenterInvitationCode={{@controller.code}}
      @certificationCenterName={{@model.certificationCenterName}}
      @certificationCenterInvitation={{@model}}
    />
  </div>
</template>
