import PixPagination from '@1024pix/pix-ui/components/pix-pagination';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import dayjs from 'dayjs';
import { t } from 'ember-intl';

import Header from '../table/header';
import CoverRateGauge from './cover-rate-gauge';
import TagLevel from './tag-level';

export default class Statistics extends Component {
  @service router;

  get analysisByTubes() {
    return this.args.model.data.sort(
      (a, b) => a.competence_code.localeCompare(b.competence_code) || a.sujet.localeCompare(b.sujet),
    );
  }

  get pageSize() {
    return Number(this.router.currentRoute?.queryParams?.pageSize) || 10;
  }

  get page() {
    return Number(this.router.currentRoute?.queryParams?.pageNumber) || 1;
  }

  get pagination() {
    return {
      page: this.page,
      pageSize: this.pageSize,
      rowCount: this.analysisByTubes.length,
      pageCount: Math.ceil(this.analysisByTubes.length / this.pageSize),
    };
  }

  get visibleAnalysisByTubes() {
    const start = this.pageSize * (this.page - 1);
    const end = this.pageSize * this.page;
    return this.analysisByTubes.slice(start, end);
  }

  get extractedDate() {
    return dayjs(this.analysisByTubes[0]?.extraction_date).format('D MMM YYYY');
  }

  <template>
    <div class="statistics-page__header">
      <h1 class="page-title">{{t "pages.statistics.title"}}</h1>
      <span class="statistics-page-header__date">{{t "pages.statistics.before-date"}}
        {{this.extractedDate}}</span>
    </div>

    <section class="statistics-page__section">
      <table class="panel">
        <caption class="screen-reader-only">{{t "pages.statistics.table.caption"}}</caption>
        <thead>
          <tr>
            <Header @size="wide" scope="col">{{t "pages.statistics.table.headers.skills"}}</Header>
            <Header @size="medium" scope="col">{{t "pages.statistics.table.headers.topics"}}</Header>
            <Header @size="medium" @align="center" scope="col">{{t
                "pages.statistics.table.headers.positioning"
              }}</Header>
            <Header @align="center" @size="medium" scope="col">{{t
                "pages.statistics.table.headers.reached-level"
              }}</Header>
          </tr>
        </thead>
        <tbody>
          {{#each this.visibleAnalysisByTubes as |line|}}
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

    <PixPagination @pagination={{this.pagination}} />
  </template>
}
