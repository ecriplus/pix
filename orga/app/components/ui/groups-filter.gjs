import PixMultiSelect from '@1024pix/pix-ui/components/pix-multi-select';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

export default class GroupsFilter extends Component {
  @tracked isLoading;
  @tracked groups;

  constructor() {
    super(...arguments);

    this.isLoading = true;
    this.args.campaign.groups.then((groups) => {
      this.groups = groups;
      this.isLoading = false;
    });
  }

  get options() {
    return this.groups?.map(({ name }) => ({ value: name, label: name }));
  }

  <template>
    {{#if this.isLoading}}
      <div class="groups-filter--is-loading placeholder-box"></div>
    {{else}}
      <PixMultiSelect
        @placeholder={{t "pages.campaign-results.filters.type.groups.title"}}
        @emptyMessage={{t "pages.campaign-results.filters.type.groups.empty"}}
        @screenReaderOnly={{true}}
        @isSearchable={{true}}
        @onChange={{@onSelect}}
        @values={{@selectedGroups}}
        @options={{this.options}}
        ...attributes
      >
        <:default as |option|>{{option.label}}</:default>
        <:label>{{t "pages.campaign-results.filters.type.groups.title"}}</:label>
      </PixMultiSelect>
    {{/if}}
  </template>
}
