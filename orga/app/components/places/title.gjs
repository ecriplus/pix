import dayjs from 'dayjs';
import { t } from 'ember-intl';

import PageTitle from '../ui/page-title';

function todayDate() {
  return dayjs().format('D MMM YYYY');
}

<template>
  <PageTitle @stickCustomData={{true}}>
    <:title>
      {{t "pages.places.title"}}
    </:title>
    <:tools>
      <span class="places-header-date">{{t "pages.places.before-date"}}
        {{todayDate}}</span>
    </:tools>
  </PageTitle>
</template>
