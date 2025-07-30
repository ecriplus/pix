import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import htmlUnsafe from 'mon-pix/helpers/html-unsafe';

export default class ProposalButton extends Component {
  @action
  onButtonClick(event) {
    if (this.args.isDisabled) {
      event.preventDefault();
    }
  }

  <template>
    <button
      class="proposal-button
        {{if @isSelected 'proposal-button--selected'}}
        {{if @isDiscoveryVariant 'proposal-button--variant-discovery'}}"
      type="submit"
      name={{@proposal.content}}
      value={{@proposal.id}}
      aria-disabled={{@isDisabled}}
      {{on "click" this.onButtonClick}}
    >
      {{htmlUnsafe @proposal.content}}
    </button>
  </template>
}
