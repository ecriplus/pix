import { t } from 'ember-intl';

import Header from '../table/header';
import CoverRateGauge from './cover-rate-gauge';
import TagLevel from './tag-level';

const analysisByTubes = (model) => {
  return model.data.sort(
    (a, b) => a.competence_code.localeCompare(b.competence_code) || a.sujet.localeCompare(b.sujet),
  );
};

<template>
  <div class="statistics-page__header">
    <h1 class="page-title">{{t "pages.statistics.title"}}</h1>
  </div>

  <section class="statistics-page__section">
    <table class="panel">
      <caption class="screen-reader-only">{{t "pages.statistics.table.caption"}}</caption>
      <thead>
        <tr>
          <Header @size="wide" scope="col">{{t "pages.statistics.table.headers.skills"}}</Header>
          <Header @size="medium" scope="col">{{t "pages.statistics.table.headers.topics"}}</Header>
          <Header @size="medium" @align="center" scope="col">{{t "pages.statistics.table.headers.positioning"}}</Header>
          <Header @align="center" @size="medium" scope="col">{{t
              "pages.statistics.table.headers.reached-level"
            }}</Header>
        </tr>
      </thead>
      <tbody>
        {{#each (analysisByTubes @model) as |line|}}
          <tr>
            <td>{{line.competence_code}} {{line.competence}}</td>
            <td>{{line.sujet}}</td>
            <td>
              <CoverRateGauge @userLevel={{line.niveau_par_user}} @tubeLevel={{line.niveau_par_sujet}} />
            </td>
            <td class="table__column--center">
              <TagLevel @level={{line.niveau_par_user}} />
            </td>
          </tr>
        {{/each}}
      </tbody>
    </table>
  </section>
</template>
