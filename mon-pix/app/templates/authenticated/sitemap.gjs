import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AppLayout from 'mon-pix/components/global/app-layout';
import Content from 'mon-pix/components/sitemap/content';
<template>
  {{pageTitle (t "pages.sitemap.title")}}
  <AppLayout>
    <Content @model={{@model}} />
  </AppLayout>
</template>
