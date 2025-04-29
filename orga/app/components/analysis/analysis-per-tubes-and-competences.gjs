import PixGauge from '@1024pix/pix-ui/components/pix-gauge';
import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { t } from 'ember-intl';

import TagLevel from '../statistics/tag-level';

<template>
  <h2 class="analysis-per-tubes-and-competences__positioning-title">{{t
      "components.analysis-per-tubes-and-competences.detailed-positioning"
    }}</h2>

  {{#each @data.levelsPerCompetence as |levelsPerCompetence|}}
    <h3 class="analysis-per-tubes-and-competences__competence-title">
      {{levelsPerCompetence.index}}
      -
      {{levelsPerCompetence.name}}
    </h3>

    <PixTable
      class="analysis-per-tubes-and-competences__competence-table"
      @condensed={{true}}
      @variant="orga"
      @caption={{t
        "components.analysis-per-tubes-and-competences.table.caption"
        index=levelsPerCompetence.index
        name=levelsPerCompetence.name
      }}
      @data={{levelsPerCompetence.levelsPerTube}}
    >
      <:columns as |tubeLevel context|>
        <PixTableColumn @context={{context}}>
          <:header>
            {{t "components.analysis-per-tubes-and-competences.table.column.tubes"}}
          </:header>
          <:cell>
            <span class="analysis-per-tubes-and-competences__tube-title">{{tubeLevel.title}}</span>
            <span class="analysis-per-tubes-and-competences__tube-description">{{tubeLevel.description}}</span>
          </:cell>
        </PixTableColumn>

        <PixTableColumn @context={{context}}>
          <:header>
            {{t "components.analysis-per-tubes-and-competences.table.column.positioning"}}
          </:header>
          <:cell>
            <PixGauge
              @isSmall={{true}}
              @maxLevel={{tubeLevel.maxLevel}}
              @reachedLevel={{tubeLevel.meanLevel}}
              @label={{t
                "components.analysis-per-tubes-and-competences.gauge.label"
                maxLevel=tubeLevel.maxLevel
                reachedLevel=tubeLevel.meanLevel
              }}
            />
          </:cell>
        </PixTableColumn>

        <PixTableColumn @context={{context}}>
          <:header>
            {{t "components.analysis-per-tubes-and-competences.table.column.level"}}
          </:header>
          <:cell>
            <TagLevel @level={{tubeLevel.meanLevel}} />
          </:cell>
        </PixTableColumn>
      </:columns>
    </PixTable>
  {{/each}}
</template>
