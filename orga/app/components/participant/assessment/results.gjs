import PixProgressBar from '@1024pix/pix-ui/components/pix-progress-bar';
import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { t } from 'ember-intl';

import multiply from '../../../helpers/multiply';

function sortedCompetenceResults(results) {
  return results.sort((a, b) => {
    return a.index.localeCompare(b.index);
  });
}

function displayResults(results) {
  return results.length > 0;
}

function competenceCount(results) {
  return results.length;
}

<template>
  <section>
    <PixTable
      @variant="orga"
      @caption={{t "pages.assessment-individual-results.table.title"}}
      @data={{sortedCompetenceResults @results}}
      class="table"
      @onRowClick={{@onClickCampaign}}
    >
      <:columns as |competenceResult context|>
        <PixTableColumn @context={{context}}>
          <:header>
            {{t "pages.assessment-individual-results.table.column.competences" count=(competenceCount @results)}}
          </:header>
          <:cell>
            <span class="competences-col__border competences-col__border--{{competenceResult.areaColor}}">
              {{competenceResult.name}}
            </span>
          </:cell>
        </PixTableColumn>

        <PixTableColumn @context={{context}}>
          <:header>
            {{t "pages.assessment-individual-results.table.column.results.label"}}
          </:header>
          <:cell>
            <PixProgressBar
              @value={{multiply competenceResult.competenceMasteryRate 100}}
              @tooltipText={{t
                "pages.assessment-individual-results.table.column.results.tooltip"
                result=competenceResult.competenceMasteryRate
                competence=competenceResult.name
                htmlSafe=true
              }}
            />
          </:cell>
        </PixTableColumn>
      </:columns>
    </PixTable>

    {{#unless (displayResults @results)}}
      <p class="table__empty content-text">{{t "pages.assessment-individual-results.table.empty"}}</p>
    {{/unless}}
  </section>
</template>
