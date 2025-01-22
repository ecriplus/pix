import PixFilterBanner from '@1024pix/pix-ui/components/pix-filter-banner';
import PixSearchInput from '@1024pix/pix-ui/components/pix-search-input';
import { get } from '@ember/helper';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import ENV from 'pix-orga/config/environment';

import { getColumnName } from '../../helpers/import-format.js';
import UiMultiSelectFilter from '../ui/multi-select-filter';

const debounceTime = ENV.pagination.debounce;

export default class LearnerFilters extends Component {
  @service intl;
  @service currentUser;

  get certificabilityOptions() {
    return [
      {
        value: 'not-available',
        label: this.intl.t('pages.sco-organization-participants.table.column.is-certifiable.not-available'),
      },
      {
        value: 'eligible',
        label: this.intl.t('pages.sco-organization-participants.table.column.is-certifiable.eligible'),
      },
      {
        value: 'non-eligible',
        label: this.intl.t('pages.sco-organization-participants.table.column.is-certifiable.non-eligible'),
      },
    ];
  }

  get isClearFiltersButtonDisabled() {
    const hasCustomFiltersValues =
      this.args.customFiltersValues && Object.values(this.args.customFiltersValues).length > 0;
    return !this.args.fullName && this.args.certificabilityFilter.length === 0 && !hasCustomFiltersValues;
  }

  get learnerCountTranslation() {
    return this.currentUser.canAccessMissionsPage
      ? this.intl.t('pages.organization-participants.filters.students-count', { count: this.args.learnersCount })
      : this.intl.t('pages.organization-participants.filters.participations-count', { count: this.args.learnersCount });
  }

  <template>
    <PixFilterBanner
      @title={{t "common.filters.title"}}
      class="participant-filter-banner hide-on-mobile"
      aria-label={{t "pages.organization-participants.filters.aria-label"}}
      @details={{this.learnerCountTranslation}}
      @clearFiltersLabel={{t "common.filters.actions.clear"}}
      @onClearFilters={{@onResetFilter}}
      @isClearFilterButtonDisabled={{this.isClearFiltersButtonDisabled}}
    >
      <PixSearchInput
        @id="fullName"
        value={{@fullName}}
        @screenReaderOnly={{true}}
        @placeholder={{t "common.filters.fullname.placeholder"}}
        @debounceTimeInMs={{debounceTime}}
        @triggerFiltering={{@onTriggerFiltering}}
      >
        <:label>{{t "common.filters.fullname.label"}}</:label>
      </PixSearchInput>
      {{#unless this.currentUser.canAccessMissionsPage}}
        <UiMultiSelectFilter
          @field="certificability"
          @label={{t "pages.organization-participants.filters.type.certificability.label"}}
          @onSelect={{@onTriggerFiltering}}
          @selectedOption={{@certificabilityFilter}}
          @options={{this.certificabilityOptions}}
          @placeholder={{t "pages.organization-participants.filters.type.certificability.placeholder"}}
          @emptyMessage=""
        />
      {{/unless}}
      {{#each @customFilters as |customFilter|}}
        {{#let (t (getColumnName customFilter)) as |columnName|}}

          <PixSearchInput
            @id="extraFilters.{{customFilter}}"
            value={{get @customFiltersValues customFilter}}
            @screenReaderOnly={{true}}
            @placeholder={{columnName}}
            @debounceTimeInMs={{debounceTime}}
            @triggerFiltering={{@onTriggerFiltering}}
          >
            <:label>{{columnName}}</:label>
          </PixSearchInput>
        {{/let}}
      {{/each}}
    </PixFilterBanner>
  </template>
}
