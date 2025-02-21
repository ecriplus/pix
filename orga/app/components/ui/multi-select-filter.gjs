import PixMultiSelect from '@1024pix/pix-ui/components/pix-multi-select';
import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class MultiSelectFilter extends Component {
  @action
  onSelect(value) {
    const { onSelect, field } = this.args;
    onSelect(field, value);
  }

  <template>
    {{#if @isLoading}}
      <div class="multi-select-filter--is-loading placeholder-box"></div>
    {{else}}
      <PixMultiSelect
        @placeholder={{@placeholder}}
        @screenReaderOnly={{true}}
        @emptyMessage={{@emptyMessage}}
        @isSearchable={{true}}
        @onChange={{this.onSelect}}
        @values={{@selectedOption}}
        @options={{@options}}
      >
        <:label>{{@label}}</:label>
        <:default as |option|>{{option.label}}</:default>
      </PixMultiSelect>
    {{/if}}
  </template>
}
