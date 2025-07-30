import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
export default class QabProposalButton extends Component {
  get ariaLabel() {
    return `Option ${this.args.option}: ${this.args.text}`;
  }

  get iconSource() {
    const icon = this.args.isSolution ? 'icon-success-filled-white.svg' : 'icon-error-filled-white.svg';
    return `/images/icons/${icon}`;
  }

  @action
  onButtonClick(event) {
    if (this.args.isDisabled) {
      event.preventDefault();
    }
  }

  <template>
    <button
      class="qab-proposal-button
        {{if @isSelected 'qab-proposal-button--selected'}}
        {{if @isSolution 'qab-proposal-button--success' 'qab-proposal-button--error'}}"
      type="submit"
      name={{@option}}
      value={{@option}}
      aria-disabled={{@isDisabled}}
      aria-label={{this.ariaLabel}}
      {{on "click" this.onButtonClick}}
    >
      <span class="qab-proposal-button__option">{{@option}}</span>
      <span class="qab-proposal-button__text">{{@text}}</span>
      {{#if @isSelected}}
        <img class="qab-proposal-button__icon" src={{this.iconSource}} />
      {{/if}}
    </button>
  </template>
}
