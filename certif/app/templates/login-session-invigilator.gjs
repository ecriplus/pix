import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import LoginSessionInvigilator from 'pix-certif/components/login-session-invigilator/index';
<template>
  {{pageTitle (t 'pages.session-supervising.login.title')}}

  <LoginSessionInvigilator
    @authenticateInvigilator={{@controller.authenticateInvigilator}}
    @currentUserEmail={{@controller.currentUserEmail}}
  />
</template>
