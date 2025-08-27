import { t } from 'ember-intl';
import pageTitle from 'ember-page-title/helpers/page-title';
import IndexClassic from 'pix-orga/components/index/classic';
import IndexMissions from 'pix-orga/components/index/missions';

<template>
  {{pageTitle (t "pages.index.title")}}
  {{#if @controller.canAccessMissionsPage}}
    <IndexMissions />
  {{else}}
    <IndexClassic @participationStatistics={{@model}} />
  {{/if}}
</template>
