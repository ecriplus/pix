import PixFilterBanner from '@1024pix/pix-ui/components/pix-filter-banner';
import PixMultiSelect from '@1024pix/pix-ui/components/pix-multi-select';
import PixSearchInput from '@1024pix/pix-ui/components/pix-search-input';
import PixTabs from '@1024pix/pix-ui/components/pix-tabs';
import { fn } from '@ember/helper';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import { eq } from 'ember-truth-helpers';
import CourseCard from 'pix-orga/components/catalogue/course-card';
import EmptyState from 'pix-orga/components/ui/empty-state';
import ENV from 'pix-orga/config/environment';

export default class List extends Component {
  @service locale;
  @service intl;

  isClearFiltersButtonDisabled() {
    return !this.args.search;
  }

  get categories() {
    return [...new Set(this.filteredItems.flatMap((item) => (item.category ? item.category : [])))].map((item) => ({
      label: this.intl.t(`pages.campaign-creation.tags.${item}`),
      value: item,
    }));
  }

  get filteredItems() {
    const { type = 'all', search = '', categories } = this.args;
    return this.args.courses
      .filter((item) => {
        if (type && type !== 'all') {
          return item.type === type;
        }
        return true;
      })
      .filter((item) => {
        if (search.length > 0) {
          return new RegExp(search, 'i').test(item.name);
        }
        return true;
      })
      .filter((item) => {
        if (categories?.length > 0) {
          return categories.includes(item.category);
        }
        return true;
      });
  }

  <template>
    {{log this.categories}}
    <div class="catalogue">
      <PixTabs @variant="orga" class="catalogue__nav" @ariaLabel={{t "pages.catalogue.tab-filters.label"}}>
        <LinkTo @route="authenticated.catalogue.list" @model="all">
          {{t "pages.catalogue.tab-filters.all"}}</LinkTo>
        <LinkTo @route="authenticated.catalogue.list" @model="targetProfile">{{t
            "pages.catalogue.tab-filters.target-profiles"
          }}</LinkTo>
        <LinkTo @route="authenticated.catalogue.list" @model="blueprint">{{t
            "pages.catalogue.tab-filters.blueprints"
          }}</LinkTo>
      </PixTabs>
      <PixFilterBanner
        class="catalogue__filters"
        @title={{t "common.filters.title"}}
        aria-label={{t "pages.catalogue.filters.aria-label"}}
        @details={{t "pages.catalogue.filters.nb-result" count=this.filteredItems.length}}
        @clearFiltersLabel={{t "common.filters.actions.clear"}}
        @onClearFilters={{@resetFilter}}
        @isClearFilterButtonDisabled={{this.isClearFiltersButtonDisabled}}
      >

        <PixSearchInput
          @id="search"
          value={{@search}}
          @screenReaderOnly={{true}}
          @placeholder={{t "pages.catalogue.filters.name.placeholder"}}
          @debounceTimeInMs={{ENV.pagination.debounce}}
          @triggerFiltering={{@updateFilter}}
        >
          <:label>{{t "pages.catalogue.filters.name.label"}}</:label>
        </PixSearchInput>

        <PixMultiSelect
          @isDisabled={{eq this.categories.length 0}}
          @placeholder={{t "pages.catalogue.filters.categories.label"}}
          @screenReaderOnly={{true}}
          @emptyMessage={{t "pages.catalogue.filters.categories.empty"}}
          @isSearchable={{false}}
          @locale={{this.locale.currentLocale}}
          @values={{@categories}}
          @options={{this.categories}}
          @onChange={{fn @updateFilter "categories"}}
        >
          <:label>{{t "pages.catalogue.filters.categories.label"}}</:label>
          <:default as |option|>{{option.label}}</:default>
        </PixMultiSelect>
      </PixFilterBanner>
      {{#if this.filteredItems}}
        <div class="catalogue__list">
          {{#each this.filteredItems as |course|}}
            <CourseCard @course={{course}} />
          {{/each}}
        </div>
      {{else}}
        <EmptyState @infoText={{t "pages.catalogue.empty-state"}} />
      {{/if}}
    </div>
  </template>
}
