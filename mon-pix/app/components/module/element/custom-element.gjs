import { action } from '@ember/object';
import didInsert from 'mon-pix/modifiers/modifier-did-insert';

import ModuleElement from './module-element';

export default class ModulixCustomElement extends ModuleElement {
  @action
  mountCustomElement(container) {
    const customElement = document.createElement(this.args.component.tagName);
    Object.assign(customElement, this.args.component.props);
    container.append(customElement);
  }

  <template><div class="element-custom" {{didInsert this.mountCustomElement}} /></template>
}
