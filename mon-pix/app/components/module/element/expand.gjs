import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';

import { htmlUnsafe } from '../../../helpers/html-unsafe';

export default class ModulixExpand extends Component {
  @action
  onExpandToggle(event) {
    const isOpen = event.srcElement.open;
    this.args.onExpandToggle({ elementId: this.args.expand.id, isOpen });
  }

  <template>
    <details class="modulix-expand" {{on "toggle" this.onExpandToggle}}>
      <summary class="modulix-expand__title">{{@expand.title}}</summary>
      {{htmlUnsafe @expand.content}}
    </details>
  </template>
}
