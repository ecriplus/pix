import PixProgressBar from '@1024pix/pix-ui/components/pix-progress-bar';
import { t } from 'ember-intl';

import multiply from '../../../helpers/multiply';
import TableHeader from '../../table/header';

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
  <section class="panel panel--light-shadow participant-results__details">
    <h3 class="screen-reader-only">{{t "pages.assessment-individual-results.table.title"}}</h3>

    <table class="content-text content-text--small">
      <thead>
        <tr>
          <TableHeader @size="wide">{{t
              "pages.assessment-individual-results.table.column.competences"
              count=(competenceCount @results)
            }}</TableHeader>
          <TableHeader @size="wide">{{t "pages.assessment-individual-results.table.column.results.label"}}</TableHeader>
        </tr>
      </thead>

      {{#if (displayResults @results)}}
        <tbody>
          {{#each (sortedCompetenceResults @results) as |competenceResult|}}
            <tr aria-label={{t "pages.assessment-individual-results.table.row-title"}}>
              <td class="competences-col__name">
                <span class="competences-col__border competences-col__border--{{competenceResult.areaColor}}"></span>
                <span>
                  {{competenceResult.name}}
                </span>
              </td>
              <td class="competences-col__gauge">
                <PixProgressBar
                  @value={{multiply competenceResult.competenceMasteryRate 100}}
                  @tooltipText={{t
                    "pages.assessment-individual-results.table.column.results.tooltip"
                    result=competenceResult.competenceMasteryRate
                    competence=competenceResult.name
                    htmlSafe=true
                  }}
                />
              </td>
            </tr>
          {{/each}}
        </tbody>
      {{/if}}
    </table>

    {{#unless (displayResults @results)}}
      <p class="table__empty content-text">{{t "pages.assessment-individual-results.table.empty"}}</p>
    {{/unless}}
  </section>
</template>
