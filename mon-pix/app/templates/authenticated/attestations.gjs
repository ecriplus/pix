import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import Content from 'mon-pix/components/attestations/content';
import AppLayout from 'mon-pix/components/global/app-layout';
<template>
  {{pageTitle (t "pages.attestations.title")}}
  <AppLayout>
    <Content />
  </AppLayout>
</template>
