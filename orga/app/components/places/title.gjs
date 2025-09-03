import dayjs from 'dayjs';
import { t } from 'ember-intl';

import PageTitle from '../ui/page-title';
import CapacityAlert from './capacity-alert';
import PlacesLotAlert from './places-lot-alert';

function todayDate() {
  return dayjs().format('D MMM YYYY');
}

<template>
  <PageTitle @spaceBetweenTools={{true}} @displayNotificationAlert={{true}}>
    <:title>
      {{t "pages.places.title"}}
    </:title>
    <:tools>
      <span class="places-header-date">{{t "pages.places.before-date"}}
        {{todayDate}}</span>
    </:tools>
    <:notificationAlert>
      <PlacesLotAlert @placesLots={{@placesLots}} />
      <CapacityAlert @occupied={{@occupied}} @total={{@total}} />
    </:notificationAlert>
  </PageTitle>
</template>
