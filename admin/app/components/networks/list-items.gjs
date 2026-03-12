import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { t } from 'ember-intl';

<template>
  {{#if @networks}}
    <PixTable @variant="admin" @caption={{t "components.networks.list.table.caption"}} @data={{@networks}}>
      <:columns as |network context|>
        <PixTableColumn @context={{context}}>
          <:header>
            {{t "common.fields.id"}}
          </:header>
          <:cell>
            {{network.id}}
          </:cell>
        </PixTableColumn>
        <PixTableColumn @context={{context}} class="break-word">
          <:header>
            {{t "common.fields.name"}}
          </:header>
          <:cell>
            {{network.name}}
          </:cell>
        </PixTableColumn>
      </:columns>
    </PixTable>
  {{else}}
    <div class="table__empty">{{t "common.tables.empty-result"}}</div>
  {{/if}}
</template>
