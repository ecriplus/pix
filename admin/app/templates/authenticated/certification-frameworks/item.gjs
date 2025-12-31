import pageTitle from 'ember-page-title/helpers/page-title';
import Header from 'pix-admin/components/certification-frameworks/item/header';

<template>
  {{pageTitle "Référentiel " @model.label " | Pix Admin" replace=true}}

  <div class="page">
    <Header @complementaryCertification={{@model}} />

    <section class="page-body certification-framework certification-framework__header">
      {{outlet}}
    </section>
  </div>
</template>
