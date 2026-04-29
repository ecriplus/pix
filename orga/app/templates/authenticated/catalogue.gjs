import { t } from 'ember-intl';
import pageTitle from 'ember-page-title/helpers/page-title';
import PageTitle from 'pix-orga/components/ui/page-title';

<template>
  {{pageTitle (t "navigation.main.catalogue")}}
  <PageTitle>
    <:title>
      {{t "pages.catalogue.title"}}
    </:title>
  </PageTitle>
  {{outlet}}
</template>
