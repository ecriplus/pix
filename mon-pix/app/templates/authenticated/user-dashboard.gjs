import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import Content from 'mon-pix/components/dashboard/content';

<template>
  {{pageTitle (t "pages.dashboard.title")}}

  <Content @model={{@controller.model}} />
</template>
