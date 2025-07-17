import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { action } from '@ember/object';
import { t } from 'ember-intl';
import didInsert from 'mon-pix/modifiers/modifier-did-insert';

import ModuleElement from './module-element';

export default class ModulixCustomElement extends ModuleElement {
  @action
  mountCustomElement(container) {
    const customElement = document.createElement(this.args.component.tagName);
    Object.assign(customElement, this.args.component.props);
    container.append(customElement);
  }

  <template>
    <div class="element-custom">
      <fieldset>
        <legend>
          <PixIcon @name="leftClick" @plainIcon={{false}} @ariaHidden={{true}} />
          <span>{{t "pages.modulix.interactiveElement.label"}}</span>
        </legend>
        <div {{didInsert this.mountCustomElement}} />
      </fieldset>
    </div>
  </template>
}
