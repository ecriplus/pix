import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { t } from 'ember-intl';

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
            Version
          </:header>
          <:cell>
            {{version}}
          </:cell>
        </PixTableColumn>
      </:columns>
    </PixTable>
  </section>
</template>
