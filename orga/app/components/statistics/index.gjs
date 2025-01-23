import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixPagination from '@1024pix/pix-ui/components/pix-pagination';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import dayjs from 'dayjs';
import { t } from 'ember-intl';

import Header from '../table/header';
import PageTitle from '../ui/page-title';
import CoverRateGauge from './cover-rate-gauge';
import TagLevel from './tag-level';

export default class Statistics extends Component {
  @service router;
  @service intl;

  @tracked currentDomainFilter = null;

  get currentLocale() {
    return this.intl.primaryLocale;
  }

  get analysisByTubes() {
    return this.args.model.data.sort(
      (a, b) => a.competence_code.localeCompare(b.competence_code) || a.sujet?.localeCompare(b.sujet),
    );
  }

  get analysisByDomains() {
    return this.analysisByTubes.reduce((acc, line) => {
      const domain = line.domaine;
      if (acc[domain]) {
        acc[domain].push(line);
      } else {
        acc[domain] = [line];
      }
      return acc;
    }, {});
  }

  get currentAnalysis() {
    if (this.currentDomainFilter !== null) {
      return this.analysisByDomains[this.currentDomainFilter];
    }
    return this.analysisByTubes;
  }

  get currentVisibleAnalysis() {
    const start = this.pageSize * (this.page - 1);
    const end = this.pageSize * this.page;
    return this.currentAnalysis.slice(start, end);
  }

  get domainsName() {
    return Object.keys(this.analysisByDomains).map((value) => {
      return {
        label: value,
        value,
      };
    });
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
      rowCount: this.currentAnalysis.length,
      pageCount: Math.ceil(this.currentAnalysis.length / this.pageSize),
    };
  }

  handleDomainFilter = (domain) => {
    this.currentDomainFilter = domain;
    this.router.replaceWith({ queryParams: { pageNumber: 1 } });
  };

  removeFilter = () => {
    this.currentDomainFilter = null;
    this.router.replaceWith({ queryParams: { pageNumber: 1 } });
  };

  get extractedDate() {
    return dayjs(this.analysisByTubes[0]?.extraction_date).format('D MMM YYYY');
  }

  get hasDataToDisplay() {
    return this.args.model.data && this.args.model.data.length > 0;
  }

  <template>
    <PageTitle @spaceBetweenTools={{true}}>
      <:title>
        {{t "pages.statistics.title"}}
      </:title>

      <:tools>
        {{#if this.hasDataToDisplay}}
          <span class="statistics-page-header__date">{{t "pages.statistics.before-date"}}
            {{this.extractedDate}}</span>
        {{/if}}
      </:tools>

    </PageTitle>

    {{#if this.hasDataToDisplay}}
      <section class="statistics-page__info">
        <p class="statistics-page-info__paragraph">
          {{t "pages.statistics.description" htmlSafe="true"}}
        </p>
      </section>

      <section class="statistics-page__filter">
        <PixSelect
          @onChange={{this.handleDomainFilter}}
          @value={{this.currentDomainFilter}}
          @options={{this.domainsName}}
          @placeholder={{t "common.filters.placeholder"}}
          @hideDefaultOption={{true}}
        >
          <:label>{{t "pages.statistics.select-label"}}</:label>
        </PixSelect>
        <PixButton @size="small" @variant="tertiary" @triggerAction={{this.removeFilter}}>{{t
            "common.filters.actions.clear"
          }}</PixButton>
      </section>

      <section class="statistics-page__cover-rate">
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
            {{#each this.currentVisibleAnalysis as |line|}}
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

      <PixPagination @pagination={{this.pagination}} @locale={{this.currentLocale}} />
    {{else}}
      <section class="panel empty-state">
        <div class="empty-state__text">
          <p>{{t "pages.statistics.empty-state"}}</p>
        </div>
      </section>
    {{/if}}
  </template>
}
