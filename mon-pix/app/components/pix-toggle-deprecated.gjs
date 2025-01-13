import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class PixToggleDeprecated extends Component {
  @tracked isFirstOn = true;

  get firstButtonClass() {
    return this.isFirstOn ? 'pix-toggle-deprecated__on' : 'pix-toggle-deprecated__off';
  }

  get secondButtonClass() {
    return this.isFirstOn ? 'pix-toggle-deprecated__off' : 'pix-toggle-deprecated__on';
  }

  @action click() {
    this.isFirstOn = !this.isFirstOn;
    if (this.args.onToggle && typeof this.args.onToggle === 'function') {
      this.args.onToggle(this.isFirstOn);
    }
  }

  <template>
    <div
      class="pix-toggle-deprecated"
      role="switch"
      aria-checked={{this.isFirstOn}}
      tabindex="0"
      {{on "click" this.click}}
    >
      <span class={{this.firstButtonClass}}>{{@valueFirstLabel}}</span>
      <span class={{this.secondButtonClass}}>{{@valueSecondLabel}}</span>
    </div>
    {{yield}}
  </template>
}
