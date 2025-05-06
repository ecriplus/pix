import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import Content from 'mon-pix/components/dashboard/content';
import AppLayout from 'mon-pix/components/global/app-layout';
<template>
  {{pageTitle (t "pages.dashboard.title")}}
  <AppLayout>
    <Content @model={{@controller.model}} />
  </AppLayout>
</template>
