import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import Start from 'mon-pix/components/certifications/start';
<template>
  {{pageTitle (t "pages.certification-start.title")}}

  <Start @certificationCandidateSubscription={{@model}} />
</template>
