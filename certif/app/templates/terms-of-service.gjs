import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import TermsOfService from 'pix-certif/components/terms-of-service/index';
<template>
  {{pageTitle (t 'pages.terms-of-service.title')}}

  <TermsOfService @isEnglishLocale={{@controller.isEnglishLocale}} @onSubmit={{@controller.submit}} />
</template>
