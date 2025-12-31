import pageTitle from 'ember-page-title/helpers/page-title';
import Header from 'pix-admin/components/certification-frameworks/item/header';
<template>
  {{pageTitle "Certification complémentaire " @model.id " | Pix Admin" replace=true}}

  <div class="page">
    <Header @complementaryCertification={{@model}} />

    <section class="page-body complementary-certification complementary-certification__header">
      {{outlet}}
    </section>
  </div>
</template>
