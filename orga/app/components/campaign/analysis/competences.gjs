import PixProgressBar from '@1024pix/pix-ui/components/pix-progress-bar';
import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { hash } from '@ember/helper';
import { t } from 'ember-intl';

function getCount(campaignCollectiveResult) {
  const competenceCollectiveResultsCount = campaignCollectiveResult.get('campaignCompetenceCollectiveResults').length;
  return competenceCollectiveResultsCount ? competenceCollectiveResultsCount : '-';
}

<template>
  <section>
    <h3 class="campaign-details-analysis__header">
      {{t "pages.campaign-review.table.competences.title"}}
    </h3>

    <PixTable
      @condensed={{true}}
      @variant="orga"
      @caption={{t "pages.campaign-review.table.competences.title"}}
      @data={{@campaignCollectiveResult.campaignCompetenceCollectiveResults}}
      class="table"
    >
      <:columns as |competenceResult context|>

        <PixTableColumn @context={{context}}>
          <:header>
            {{t
              "pages.campaign-review.table.competences.column.competences"
              (hash count=(getCount @campaignCollectiveResult))
              htmlSafe=true
            }}
          </:header>
          <:cell>
            <span class="competences-col__border competences-col__border--{{competenceResult.areaColor}}">
              {{competenceResult.competenceName}}
            </span>
          </:cell>
        </PixTableColumn>

        <PixTableColumn @context={{context}}>
          <:header>
            {{t "pages.campaign-review.table.competences.column.results.label"}}
          </:header>
          <:cell>
            <PixProgressBar
              @value={{competenceResult.validatedSkillsPercentage}}
              @tooltipText={{t
                "pages.campaign-review.table.competences.column.results.tooltip"
                result=competenceResult.validatedSkillsPercentage
                competence=competenceResult.competenceName
                htmlSafe=true
              }}
            />
          </:cell>
        </PixTableColumn>
      </:columns>
    </PixTable>
  </section>
</template>
