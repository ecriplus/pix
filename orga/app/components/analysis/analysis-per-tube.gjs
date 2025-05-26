import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { t } from 'ember-intl';
import CoverRateGauge from 'pix-orga/components/statistics/cover-rate-gauge';

import TagLevel from '../statistics/tag-level';

<template>
  <p class="analysis__description">
    {{t "components.analysis-per-tube.description"}}
  </p>

  {{#each @data.levelsPerCompetence as |levelsPerCompetence|}}
    <h3 class="analysis__competence-title">
      {{levelsPerCompetence.index}}
      -
      {{levelsPerCompetence.name}}
    </h3>

    <PixTable
      class="analysis__table"
      @condensed={{true}}
      @variant="orga"
      @caption={{t
        "components.analysis-per-tube.table.caption"
        index=levelsPerCompetence.index
        name=levelsPerCompetence.name
      }}
      @data={{levelsPerCompetence.levelsPerTube}}
    >
      <:columns as |tubeLevel context|>
        <PixTableColumn @context={{context}} class="analysis__description-column">
          <:header>
            {{t "components.analysis-per-tube.table.column.tubes"}}
          </:header>
          <:cell>
            <span class="analysis__tube-title">{{tubeLevel.title}}</span>
            <span class="analysis__tube-description">{{tubeLevel.description}}</span>
          </:cell>
        </PixTableColumn>

        <PixTableColumn @context={{context}}>
          <:header>
            {{t "components.analysis-per-tube.table.column.positioning"}}
          </:header>
          <:cell>
            <CoverRateGauge
              @label="components.analysis-per-tube.cover-rate-gauge-label"
              @hideMaxMin={{true}}
              @userLevel={{tubeLevel.meanLevel}}
              @tubeLevel={{tubeLevel.maxLevel}}
            />
          </:cell>
        </PixTableColumn>

        <PixTableColumn @context={{context}} class="analysis__level-column">
          <:header>
            {{t "components.analysis-per-tube.table.column.level"}}
          </:header>
          <:cell>
            <TagLevel @level={{tubeLevel.meanLevel}} />
          </:cell>
        </PixTableColumn>
      </:columns>
    </PixTable>
  {{/each}}
</template>
