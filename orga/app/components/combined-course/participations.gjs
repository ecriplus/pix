import PixFilterBanner from '@1024pix/pix-ui/components/pix-filter-banner';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixMultiSelect from '@1024pix/pix-ui/components/pix-multi-select';
import PixPagination from '@1024pix/pix-ui/components/pix-pagination';
import PixSearchInput from '@1024pix/pix-ui/components/pix-search-input';
import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';
import { uniqueId } from '@ember/helper';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import EmptyState from 'pix-orga/components/campaign/empty-state';
import ParticipationStatus from 'pix-orga/components/ui/participation-status';
import ENV from 'pix-orga/config/environment';
import { COMBINED_COURSE_PARTICIPATION_STATUSES } from 'pix-orga/models/combined-course-participation.js';

const debounceTime = ENV.pagination.debounce;

export default class CombinedCourse extends Component {
  @service intl;
  @service locale;
  @service currentUser;

  get statusOptions() {
    return [
      {
        label: this.intl.t('pages.combined-course.filters.status.STARTED'),
        value: COMBINED_COURSE_PARTICIPATION_STATUSES.STARTED,
      },
      {
        label: this.intl.t('pages.combined-course.filters.status.COMPLETED'),
        value: COMBINED_COURSE_PARTICIPATION_STATUSES.COMPLETED,
      },
    ];
  }

  @action
  onSelectStatus(statuses) {
    this.args.onFilter('statuses', statuses);
  }

  @action
  onSearchFullName(name, value) {
    this.args.onFilter('fullName', value);
  }

  <template>
    <PixFilterBanner @clearFiltersLabel={{t "common.filters.actions.clear"}} @onClearFilters={{@clearFilters}}>
      <PixSearchInput
        @debounceTimeInMs={{debounceTime}}
        value={{@fullNameFilter}}
        @placeholder={{t "common.filters.fullname.placeholder"}}
        @screenReaderOnly={{true}}
        @triggerFiltering={{this.onSearchFullName}}
      >
        <:label>{{t "common.filters.fullname.label"}}</:label>
      </PixSearchInput>

      <PixMultiSelect
        @placeholder={{t "pages.combined-course.filters.status.placeholder"}}
        @screenReaderOnly={{true}}
        @options={{this.statusOptions}}
        @onChange={{this.onSelectStatus}}
        @values={{@statusFilter}}
        @hideDefaultOption={{false}}
      >
        <:label>{{t "pages.combined-course.filters.by-status"}}</:label>
        <:default as |option|>{{option.label}}</:default>
      </PixMultiSelect>
    </PixFilterBanner>

    {{#if @participations.length}}
      <PixTable
        @variant="orga"
        @caption={{t "pages.combined-course.table.description"}}
        @data={{@participations}}
        class="table"
      >
        <:columns as |participation context|>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.combined-course.table.column.last-name"}}
            </:header>
            <:cell>
              {{participation.lastName}}
            </:cell>
          </PixTableColumn>

          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.combined-course.table.column.first-name"}}
            </:header>
            <:cell>
              {{participation.firstName}}
            </:cell>
          </PixTableColumn>

          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.combined-course.table.column.status"}}
            </:header>
            <:cell>
              <ParticipationStatus @status={{participation.status}} />
            </:cell>
          </PixTableColumn>

          {{#if @hasCampaigns}}
            <PixTableColumn @context={{context}} @type="number">
              <:header>
                {{t "pages.combined-course.table.column.campaigns"}}

                <Tooltip @content={{t "pages.combined-course.table.tooltip.campaigns-column"}} />
              </:header>
              <:cell>
                <CompletionDisplay
                  @translationKey="pages.combined-course.table.campaign-completion"
                  @nbItems={{participation.nbCampaigns}}
                  @nbItemsCompleted={{participation.nbCampaignsCompleted}}
                />
              </:cell>
            </PixTableColumn>
          {{/if}}

          {{#if @hasModules}}
            <PixTableColumn @context={{context}} @type="number">
              <:header>
                {{t "pages.combined-course.table.column.modules"}}

                <Tooltip @content={{t "pages.combined-course.table.tooltip.modules-column"}} />
              </:header>
              <:cell>
                <CompletionDisplay
                  @translationKey="pages.combined-course.table.module-completion"
                  @nbItems={{participation.nbModules}}
                  @nbItemsCompleted={{participation.nbModulesCompleted}}
                />
              </:cell>
            </PixTableColumn>
          {{/if}}

        </:columns>
      </PixTable>
      {{#if @participations.meta}}
        <PixPagination @pagination={{@participations.meta}} @locale={{this.locale.currentLanguage}} />
      {{/if}}
    {{else}}
      <EmptyState />
    {{/if}}
  </template>
}

const CompletionDisplay = <template>
  <span aria-hidden="true">{{@nbItemsCompleted}}/{{@nbItems}}</span>
  <span class="screen-reader-only">
    {{t @translationKey count=@nbItemsCompleted nbCampaigns=@nbItems}}
  </span>
</template>;

const tooltipId = uniqueId();

const Tooltip = <template>
  <PixTooltip @id={{tooltipId}} @isWide={{true}}>
    <:triggerElement>

      <PixIcon
        @name="help"
        @plainIcon={{true}}
        aria-label={{@content}}
        aria-describedby={{tooltipId}}
        @ariaHidden={{@ariaHiddenIcon}}
        @ariaHiddenIcon={{true}}
        class="tooltip-with-icon-small"
      />

    </:triggerElement>

    <:tooltip>
      {{@content}}
    </:tooltip>

  </PixTooltip>
</template>;
