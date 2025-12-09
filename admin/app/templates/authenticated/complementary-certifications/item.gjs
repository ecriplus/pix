import pageTitle from 'ember-page-title/helpers/page-title';
import Header from 'pix-admin/components/complementary-certifications/item/header';
<template>
  {{pageTitle "Certification complémentaire " @model.id " | Pix Admin" replace=true}}

  <Header @complementaryCertification={{@model}} />

  <section class="page-body complementary-certification complementary-certification__header">
    {{outlet}}
  </section>
</template>
