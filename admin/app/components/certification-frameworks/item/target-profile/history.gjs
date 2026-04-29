import PixAccordions from "@1024pix/pix-ui/components/pix-accordions";
import PixIcon from "@1024pix/pix-ui/components/pix-icon";
import PixTable from "@1024pix/pix-ui/components/pix-table";
import PixTableColumn from "@1024pix/pix-ui/components/pix-table-column";
import { LinkTo } from "@ember/routing";
import { t } from "ember-intl";
import formatDate from "ember-intl/helpers/format-date";

<template>
  <section class="page-section framework-target-profiles-history">
    <PixAccordions>
      <:title>
        {{t "components.complementary-certifications.target-profiles.history-list.title"}}
      </:title>
      <:content>
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
                {{row.name}}
              </:cell>
            </PixTableColumn>
            <PixTableColumn @context={{targetProfileHistory}}>
              <:header>
                <PixIcon @name="calendar" @ariaHidden={{true}} />
              {{t "components.complementary-certifications.target-profiles.history-list.headers.attached-at"}}
              </:header>
              <:cell>
                <strong>{{formatDate row.attachedAt}}</strong>
              </:cell>
            </PixTableColumn>
            <PixTableColumn @context={{targetProfileHistory}}>
              <:header>
                <PixIcon @name="calendar" @ariaHidden={{true}} />
              {{t "components.complementary-certifications.target-profiles.history-list.headers.detached-at"}}
              </:header>
              <:cell>
                <strong>{{if row.detachedAt (formatDate row.detachedAt) "-"}}</strong>
              </:cell>
            </PixTableColumn>
            <PixTableColumn @context={{targetProfileHistory}}>
              <:header>
                {{t "components.complementary-certifications.target-profiles.history-list.headers.actions"}}
              </:header>
              <:cell>
                <LinkTo
                  @route="authenticated.target-profiles.target-profile"
                  @model={{row.id}}
                  class="framework-target-profiles-history__action-link"
                  aria-label={{t "components.complementary-certifications.target-profiles.history-list.actions.view"}}
                >
                  <PixIcon @name="eye" @ariaHidden={{true}} />
                </LinkTo>
              </:cell>
            </PixTableColumn>
          </:columns>
        </PixTable>
      </:content>
    </PixAccordions>
  </section>
</template>
