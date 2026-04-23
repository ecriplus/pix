import PixFilterBanner from '@1024pix/pix-ui/components/pix-filter-banner';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { debounceTask } from 'ember-lifeline';
import ENV from 'pix-certif/config/environment';

import { CREATED, FINALIZED, PROCESSED } from '../../models/session-management';
import NoSessionPanel from './no-session-panel';
import SessionList from './session-list';
import SessionListHeader from './session-list-header';

const SESSION_STATUSES = [CREATED, FINALIZED, PROCESSED];

const DEFAULT_PAGE_NUMBER = 1;

export default class Sessions extends Component {
  @service currentUser;
  @service intl;
  @service router;

  @tracked pageNumber = DEFAULT_PAGE_NUMBER;
  @tracked pageSize = 25;
  @tracked sessionIdFilter = this.args.sessionId ?? null;
  @tracked selectedStatusFilter = this.args.status ?? this.statusFilterOptions[0].value;

  get sessionSummaries() {
    return this.args.sessionSummaries;
  }

  get statusFilterOptions() {
    const sessionStatusesOptions = SESSION_STATUSES.map((status) => ({
      value: status,
      label: this.intl.t(`pages.sessions.list.status.${status}`),
    }));

    return [{ value: 'all', label: this.intl.t(`pages.sessions.list.status.all`) }, ...sessionStatusesOptions];
  }

  @action
  goToSessionDetails(session) {
    this.router.transitionTo('authenticated.sessions.details', session.id);
  }

  @action
  async handleStatusFilterChange(status) {
    this.selectedStatusFilter = status;
    this.router.transitionTo({ queryParams: { status: status !== 'all' ? status : null, pageNumber: 1 } });
  }

  @action
  handleSessionIdFilterChange(event) {
    this.sessionIdFilter = event.target.value;
    debounceTask(this, '_transitionWithSessionIdFilter', ENV.APP.DEBOUNCE_FILTER_DELAY);
  }

  _transitionWithSessionIdFilter() {
    this.router.transitionTo({ queryParams: { sessionId: this.sessionIdFilter || null, pageNumber: 1 } });
  }

  @action
  handleLoadFilters(e) {
    e.preventDefault();
  }

  <template>
    <div class='session-list-page'>
      {{#if @sessionSummaries.meta.hasSessions}}
        <SessionListHeader />

        <PixFilterBanner
          @title={{t 'pages.sessions.list.filters.title'}}
          class='session-list-page__filters'
          aria-label={{t 'pages.sessions.list.filters.label'}}
          @onLoadFilters={{this.handleLoadFilters}}
        >
          <PixInput
            type='number'
            @value={{this.sessionIdFilter}}
            {{on 'input' this.handleSessionIdFilterChange}}
            @size='small'
          >
            <:label>{{t 'pages.sessions.list.filters.session-id.label'}}</:label>
          </PixInput>
          <PixSelect
            @options={{this.statusFilterOptions}}
            @value={{this.selectedStatusFilter}}
            @onChange={{this.handleStatusFilterChange}}
            @hideDefaultOption={{true}}
            @size='small'
          >
            <:label>{{t 'pages.sessions.list.filters.status.label'}}</:label>
          </PixSelect>
        </PixFilterBanner>

        <SessionList @sessionSummaries={{this.sessionSummaries}} @goToSessionDetails={{this.goToSessionDetails}} />
      {{else}}
        <NoSessionPanel />
      {{/if}}
    </div>
  </template>
}
