import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { t } from 'ember-intl';

import CoverRateGauge from '../statistics/cover-rate-gauge';
import TagLevel from '../statistics/tag-level';

<template>
  <p class="analysis__description">
    {{t "components.analysis-per-competence.description"}}
  </p>

  <PixTable
    class="analysis__table"
    @condensed={{true}}
    @variant="orga"
    @caption={{t "components.analysis-per-competence.table.caption"}}
    @data={{@data.levelsPerCompetence}}
  >
    <:columns as |competenceLevel context|>

      <PixTableColumn @context={{context}} class="analysis__description-column">
        <:header>
          {{t "components.analysis-per-competence.table.column.competences"}}
        </:header>
        <:cell>
          <span class="analysis__competence-title">
            {{competenceLevel.index}}
            -
            {{competenceLevel.name}}
          </span>
          <span class="analysis__competence-description">{{competenceLevel.description}}</span>
        </:cell>
      </PixTableColumn>

      <PixTableColumn @context={{context}}>
        <:header>
          {{t "components.analysis-per-competence.table.column.positioning"}}
        </:header>
        <:cell>
          <CoverRateGauge
            @label="components.analysis-per-competence.cover-rate-gauge-label"
            @hideMaxMin={{true}}
            @userLevel={{competenceLevel.meanLevel}}
            @tubeLevel={{competenceLevel.maxLevel}}
          />
        </:cell>
      </PixTableColumn>

      <PixTableColumn @context={{context}} class="analysis__level-column">
        <:header>
          {{t "components.analysis-per-competence.table.column.level"}}
        </:header>
        <:cell>
          <TagLevel @level={{competenceLevel.meanLevel}} />
        </:cell>
      </PixTableColumn>

    </:columns>
  </PixTable>
</template>
