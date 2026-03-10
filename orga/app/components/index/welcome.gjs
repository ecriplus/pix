import { t } from 'ember-intl';
import { and } from 'ember-truth-helpers';
import ScoBanner from 'pix-orga/components/banner/sco-banner';
import PageTitle from 'pix-orga/components/ui/page-title';

<template>
  <PageTitle class="welcome__title" @displayNotificationAlert={{and @displayScoBanner @scoBannerContent}}>
    <:title>
      {{t "components.index.welcome.title" name=@firstName}}
    </:title>

    <:subtitle>
      {{@description}}
    </:subtitle>

    <:notificationAlert>
      <ScoBanner @content={{@scoBannerContent}} />
    </:notificationAlert>
  </PageTitle>
</template>
