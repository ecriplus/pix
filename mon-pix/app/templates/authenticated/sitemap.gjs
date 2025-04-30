import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import Content from 'mon-pix/components/sitemap/content';
<template>
  {{pageTitle (t "pages.sitemap.title")}}

  <Content @model={{@model}} />
</template>
