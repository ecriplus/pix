import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AppLayout from 'mon-pix/components/global/app-layout';
<template>
  {{pageTitle (t "pages.user-tutorials.title")}}
  <AppLayout>
    {{outlet}}
  </AppLayout>
</template>
