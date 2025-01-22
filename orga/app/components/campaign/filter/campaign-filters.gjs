import PixFilterBanner from '@1024pix/pix-ui/components/pix-filter-banner';
import PixSearchInput from '@1024pix/pix-ui/components/pix-search-input';
import PixToggleButton from '@1024pix/pix-ui/components/pix-toggle-button';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import ENV from 'pix-orga/config/environment';

const debounceTime = ENV.pagination.debounce;

export default class CampaignFilters extends Component {
  get isToggleSwitched() {
    return this.args.statusFilter !== 'archived';
  }

  get isClearFiltersButtonDisabled() {
    return (
      !this.args.nameFilter &&
      !this.args.statusFilter &&
      (this.args.listOnlyCampaignsOfCurrentUser || !this.args.ownerNameFilter)
    );
  }

  @action
  onToggle() {
    const status = this.isToggleSwitched ? 'archived' : null;
    this.args.onFilter('status', status);
  }

  <template>
    <PixFilterBanner
      @title={{t "common.filters.title"}}
      class="participant-filter-banner hide-on-mobile"
      aria-label={{t "pages.campaigns-list.filter.legend"}}
      @details={{t "pages.campaigns-list.filter.results" total=@numResults}}
      @clearFiltersLabel={{t "common.filters.actions.clear"}}
      @isClearFilterButtonDisabled={{this.isClearFiltersButtonDisabled}}
      @onClearFilters={{@onClearFilters}}
    >
      <PixSearchInput
        @id="name"
        value={{@nameFilter}}
        @screenReaderOnly={{true}}
        @placeholder={{t "pages.campaigns-list.filter.by-name"}}
        @debounceTimeInMs={{debounceTime}}
        @triggerFiltering={{@onFilter}}
      >
        <:label>{{t "pages.campaigns-list.filter.by-name"}}</:label>
      </PixSearchInput>
      {{#unless @listOnlyCampaignsOfCurrentUser}}
        <PixSearchInput
          @id="ownerName"
          value={{@ownerNameFilter}}
          @screenReaderOnly={{true}}
          @placeholder={{t "pages.campaigns-list.filter.by-owner"}}
          @debounceTimeInMs={{debounceTime}}
          @triggerFiltering={{@onFilter}}
        >
          <:label>{{t "pages.campaigns-list.filter.by-owner"}}</:label>
        </PixSearchInput>
      {{/unless}}

      <PixToggleButton @toggled={{this.isToggleSwitched}} @onChange={{this.onToggle}} @screenReaderOnly={{true}}>
        <:label>{{t "pages.campaigns-list.action.campaign.label"}}</:label>
        <:viewA>{{t "pages.campaigns-list.action.campaign.ongoing"}}</:viewA>
        <:viewB>{{t "pages.campaigns-list.action.campaign.archived"}}</:viewB>
      </PixToggleButton>
    </PixFilterBanner>
  </template>
}
