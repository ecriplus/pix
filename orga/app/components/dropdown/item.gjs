import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class DropdownItem extends Component {
  @action
  handleKeyUp(event) {
    if (event.key === 'Enter') {
      this.onClick(event);
    }
  }

  @action
  onClick(event) {
    this.args.onClick(event);
    if (typeof this.args.closeMenu === 'function') {
      this.args.closeMenu();
    }
  }

  <template>
    <li class="dropdown__item dropdown__item--link" {{on "keyup" this.handleKeyUp}} ...attributes>
      <button type="button" {{on "click" this.onClick}}>
        {{yield}}
      </button>
    </li>
  </template>
}
