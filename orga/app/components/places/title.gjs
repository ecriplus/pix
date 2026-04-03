import { formatDate, t } from 'ember-intl';

import PageTitle from '../ui/page-title';
import CapacityAlert from './capacity-alert';
import PlacesLotAlert from './places-lot-alert';

function today() {
  return new Date();
}

<template>
  <PageTitle @spaceBetweenTools={{true}} @displayNotificationAlert={{true}}>
    <:title>
      {{t "pages.places.title"}}
    </:title>
    <:tools>
      <span class="places-header-date">{{t "pages.places.before-date"}}
        {{formatDate (today) format="LLL"}}</span>
    </:tools>
    <:notificationAlert>
      <PlacesLotAlert @placesLots={{@placesLots}} />
      <CapacityAlert @occupied={{@occupied}} @total={{@total}} />
    </:notificationAlert>
  </PageTitle>
</template>
