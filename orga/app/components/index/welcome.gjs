import { t } from 'ember-intl';
import ScoBanner from 'pix-orga/components/banner/sco-banner';
import PageTitle from 'pix-orga/components/ui/page-title';

<template>
  <PageTitle class="welcome__title" @displayNotificationAlert={{@displayScoBanner}}>
    <:title>
      {{t "components.index.welcome.title" name=@firstName}}
    </:title>

    <:subtitle>
      {{@description}}
    </:subtitle>

    <:notificationAlert>
      <ScoBanner />
    </:notificationAlert>
  </PageTitle>
</template>
