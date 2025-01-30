import { t } from 'ember-intl';

import TableHeader from '../../table/header';

<template>
  <section class="profile-competences panel">
    <h3 class="screen-reader-only">{{t "pages.profiles-individual-results.table.title"}}</h3>
    <table>
      <thead>
        <tr>
          <TableHeader @size="wide">
            {{t "pages.profiles-individual-results.table.column.skill"}}
          </TableHeader>
          <TableHeader @size="small" @align="center">{{t
              "pages.profiles-individual-results.table.column.level"
            }}</TableHeader>
          <TableHeader @size="small" @align="center">{{t
              "pages.profiles-individual-results.table.column.pix-score"
            }}</TableHeader>
        </tr>
      </thead>
      <tbody>
        {{#each @competences as |competence|}}
          <tr aria-label={{t "pages.profiles-individual-results.table.row-title"}}>
            <td class="competences-col__name">
              <span class="competences-col__border competences-col__border--{{competence.areaColor}}"></span>
              <span>
                {{competence.name}}
              </span>
            </td>
            <td class="table__column--center">
              {{competence.estimatedLevel}}
            </td>
            <td class="table__column--center">
              {{competence.pixScore}}
            </td>
          </tr>
        {{/each}}
      </tbody>
    </table>

    {{#unless @isShared}}
      <p class="table__empty content-text">
        {{t "pages.profiles-individual-results.table.empty"}}
      </p>
    {{/unless}}
  </section>
</template>
