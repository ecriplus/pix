import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import SessionDetails from 'pix-certif/components/sessions/session-details/index';
<template>
  {{pageTitle (t 'pages.sessions.detail.page-title' sessionId=@controller.model.session.id) replace=true}}

  <div class='session-details-page'>
    <SessionDetails @model={{@controller.model}} />
    {{outlet}}
  </div>
</template>
