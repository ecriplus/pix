import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { t } from 'ember-intl';

<template>
  <PixTable
    @variant="admin"
    @caption={{t "pages.certifications.certification.result.table.label"}}
    @data={{@competences}}
  >
    <:columns as |competence context|>
      <PixTableColumn @context={{context}}>
        <:header>
          {{t "pages.certifications.certification.result.table.headers.competence"}}
        </:header>
        <:cell>
          {{competence.index}}
        </:cell>
      </PixTableColumn>
      {{#if @shouldDisplayPixScore}}
        <PixTableColumn @context={{context}}>
          <:header>
            {{t "pages.certifications.certification.result.table.headers.score"}}
          </:header>
          <:cell>
            {{competence.score}}
          </:cell>
        </PixTableColumn>
      {{/if}}
      <PixTableColumn @context={{context}}>
        <:header>
          {{t "pages.certifications.certification.result.table.headers.level"}}
        </:header>
        <:cell>
          {{competence.level}}
        </:cell>
      </PixTableColumn>
    </:columns>
  </PixTable>
</template>
