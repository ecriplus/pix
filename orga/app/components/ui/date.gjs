import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import { t } from 'ember-intl';

<template>
  {{#if @date}}
    {{dayjsFormat @date "DD/MM/YYYY"}}
  {{else}}
    <span aria-hidden="true">-</span>
    <span class="screen-reader-only">{{t "components.date.no-date"}}</span>
  {{/if}}
</template>
