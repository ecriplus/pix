import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { t } from 'ember-intl';
import formatDate from 'ember-intl/helpers/format-date';

<template>
  <section class="framework-details">
    <h2 class="framework-details__title">
      {{t "components.complementary-certifications.item.framework.history.title"}}
    </h2>

    <PixTable
      @variant="admin"
      @caption={{t "components.complementary-certifications.item.framework.history.table.caption"}}
      @data={{@history}}
    >
      <:columns as |version context|>
        <PixTableColumn @context={{context}}>
          <:header>
            {{t "components.complementary-certifications.item.framework.history.table.columns.version-id"}}
          </:header>
          <:cell>
            {{version.id}}
          </:cell>
        </PixTableColumn>
        <PixTableColumn @context={{context}}>
          <:header>
            {{t "components.complementary-certifications.item.framework.history.table.columns.start-date"}}
          </:header>
          <:cell>
            {{formatDate version.startDate}}
          </:cell>
        </PixTableColumn>
        <PixTableColumn @context={{context}}>
          <:header>
            {{t "components.complementary-certifications.item.framework.history.table.columns.expiration-date"}}
          </:header>
          <:cell>
            {{#if version.expirationDate}}
              {{formatDate version.expirationDate}}
            {{/if}}
          </:cell>
        </PixTableColumn>
      </:columns>
    </PixTable>
  </section>
</template>
