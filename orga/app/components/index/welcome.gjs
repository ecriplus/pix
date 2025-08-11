import { t } from 'ember-intl';
import PageTitle from 'pix-orga/components/ui/page-title';

<template>
  <PageTitle class="welcome__title">
    <:title>
      {{t "components.index.welcome.title" name=@firstName}}
    </:title>
    <:subtitle>
      {{@description}}
    </:subtitle>
  </PageTitle>
</template>
