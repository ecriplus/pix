import Component from '@glimmer/component';
export default class QabProposalButton extends Component {
  get ariaLabel() {
    return `Option ${this.args.option}: ${this.args.text}`;
  }

  get iconSource() {
    const icon = this.args.isSolution ? 'icon-success-filled-white.svg' : 'icon-error-filled-white.svg';
    return `/images/icons/${icon}`;
  }

  <template>
    <button
      class="qab-proposal-button
        {{if @isSelected 'qab-proposal-button--selected'}}
        {{if @isSolution 'qab-proposal-button--success' 'qab-proposal-button--error'}}"
      type="submit"
      name={{@option}}
      value={{@option}}
      disabled={{@isDisabled}}
      aria-label={{this.ariaLabel}}
    >
      <span class="qab-proposal-button__option">{{@option}}</span>
      <span class="qab-proposal-button__text">{{@text}}</span>
      {{#if @isSelected}}
        <img class="qab-proposal-button__icon" src={{this.iconSource}} />
      {{/if}}
    </button>
  </template>
}
