import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';

<template>
  {{pageTitle (t 'pages.logout.page-title')}}
  {{outlet}}
</template>
