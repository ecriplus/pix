import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class DropdownItem extends Component {
  @action
  handleKeyUp(event) {
    if (event.key === 'Enter') {
      this.args.onClick();
    }
  }

  <template>
    <li class='dropdown__item dropdown__item--link' ...attributes>
      <button type='button' {{on 'click' @onClick}}>
        {{yield}}
      </button>
    </li>
  </template>
}
