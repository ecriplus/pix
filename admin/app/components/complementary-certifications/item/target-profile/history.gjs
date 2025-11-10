import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { LinkTo } from '@ember/routing';
import { t } from 'ember-intl';
import formatDate from 'ember-intl/helpers/format-date';

<template>
  <section class="page-section">
    <h2 class="complementary-certification-details__history-title page-section__header">
      {{t "components.complementary-certifications.target-profiles.history-list.title"}}
    </h2>
    <PixTable
      @variant="admin"
      @data={{@targetProfilesHistory}}
      @caption={{t "components.complementary-certifications.target-profiles.history-list.caption"}}
    >
      <:columns as |row targetProfileHistory|>
        <PixTableColumn @context={{targetProfileHistory}}>
          <:header>
            {{t "components.complementary-certifications.target-profiles.history-list.headers.name"}}
          </:header>
          <:cell>
            <LinkTo
              @route="authenticated.target-profiles.target-profile"
              @model={{row.id}}
              class="complementary-certification-details-target-profile__link"
            >
              {{row.name}}
            </LinkTo>
          </:cell>
        </PixTableColumn>
        <PixTableColumn @context={{targetProfileHistory}}>
          <:header>
            {{t "components.complementary-certifications.target-profiles.history-list.headers.attached-at"}}
          </:header>
          <:cell>
            {{formatDate row.attachedAt}}
          </:cell>
        </PixTableColumn>
        <PixTableColumn @context={{targetProfileHistory}}>
          <:header>
            {{t "components.complementary-certifications.target-profiles.history-list.headers.detached-at"}}
          </:header>
          <:cell>
            {{if row.detachedAt (formatDate row.detachedAt) "-"}}
          </:cell>
        </PixTableColumn>
      </:columns>
    </PixTable>
  </section>
</template>
