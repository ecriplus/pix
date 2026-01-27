import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import EditionForm from 'pix-certif/components/sessions/edition-form';
<template>
  {{pageTitle @controller.pageTitle replace=true}}
  <h1 class='page-title'>{{t 'pages.sessions.new.title'}}</h1>
  <EditionForm @session={{@controller.session}} />
</template>
