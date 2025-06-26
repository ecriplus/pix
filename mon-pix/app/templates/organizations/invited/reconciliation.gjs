import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import Reconciliation from 'mon-pix/components/pages/organizations/invited/reconciliation';
<template>
  {{pageTitle (t "pages.join.title")}}

  <Reconciliation @model={{@model}} />
</template>
