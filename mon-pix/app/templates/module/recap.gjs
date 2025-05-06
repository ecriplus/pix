import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import Recap from 'mon-pix/components/module/instruction/recap';
<template>
  {{pageTitle (t "pages.modulix.recap.title")}}

  <div class="modulix">
    <Recap @module={{@model.module}} @passage={{@model.passage}} />
  </div>
</template>
