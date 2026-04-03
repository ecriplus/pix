import { formatDate, t } from 'ember-intl';

<template>
  {{#if @date}}
    {{formatDate @date}}
  {{else}}
    <span aria-hidden="true">-</span>
    <span class="screen-reader-only">{{t "components.date.no-date"}}</span>
  {{/if}}
</template>
