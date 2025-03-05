import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import dayjs from 'dayjs';
import { t } from 'ember-intl';
import { eq, gt } from 'ember-truth-helpers';

import { STATUSES } from '../../models/organization-places-lot';
import EmptyState from '../ui/empty-state.js';

function displayDate(date) {
  return dayjs(date).format('DD/MM/YYYY');
}

function emptyCell(value) {
  return value ? value : '-';
}

<template>
  {{#if (gt @placesLots.length 0)}}
    <h2 class="places-lots_title">{{t "pages.places.places-lots.table.title"}}</h2>

    <PixTable
      @variant="orga"
      @caption={{t "pages.places.places-lots.table.caption"}}
      @data={{@placesLots}}
      class="table"
      @onRowClick={{@onClickCampaign}}
    >
      <:columns as |placesLot context|>
        <PixTableColumn @context={{context}} @type="number">
          <:header>
            {{t "pages.places.places-lots.table.headers.count"}}
          </:header>
          <:cell>
            {{emptyCell placesLot.count}}
          </:cell>
        </PixTableColumn>

        <PixTableColumn @context={{context}}>
          <:header>
            {{t "pages.places.places-lots.table.headers.activation-date"}}
          </:header>
          <:cell>
            {{displayDate placesLot.activationDate}}
          </:cell>
        </PixTableColumn>

        <PixTableColumn @context={{context}}>
          <:header>
            {{t "pages.places.places-lots.table.headers.expiration-date"}}
          </:header>
          <:cell>
            {{emptyCell (displayDate placesLot.expirationDate)}}
          </:cell>
        </PixTableColumn>

        <PixTableColumn @context={{context}}>
          <:header>
            {{t "pages.places.places-lots.table.headers.status"}}
          </:header>
          <:cell>
            {{#if (eq placesLot.status STATUSES.PENDING)}}
              <PixTag @color="tertiary">{{t "pages.places.places-lots.statuses.pending"}}</PixTag>
            {{else if (eq placesLot.status STATUSES.ACTIVE)}}
              <PixTag @color="success">{{t "pages.places.places-lots.statuses.active"}}</PixTag>
            {{else}}
              <PixTag @color="neutral">{{t "pages.places.places-lots.statuses.expired"}}</PixTag>
            {{/if}}
          </:cell>
        </PixTableColumn>
      </:columns>
    </PixTable>

  {{else}}
    <div class="places-lots_empty-state">
      <EmptyState @infoText={{t "pages.places.places-lots.table.empty-state"}} />
    </div>
  {{/if}}
</template>
