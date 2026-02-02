import { t } from 'ember-intl';
import ScoCommunication from 'pix-orga/components/banner/sco-communication';
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
      <ScoCommunication @forceDisplayBanner={{true}} />
    </:notificationAlert>
  </PageTitle>
</template>
