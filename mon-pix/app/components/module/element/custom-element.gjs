import { metadata } from '@1024pix/epreuves-components/metadata';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import didInsert from 'mon-pix/modifiers/modifier-did-insert';

import ModuleElement from './module-element';

export default class ModulixCustomElement extends ModuleElement {
  @tracked
  customElement;

  @tracked
  resetButtonDisplayed = false;

  @action
  mountCustomElement(container) {
    this.customElement = document.createElement(this.args.component.tagName);
    Object.assign(this.customElement, this.args.component.props);
    container.append(this.customElement);

    if (this.customElement.reset !== undefined) {
      this.resetButtonDisplayed = true;
    }
  }

  @action
  resetCustomElement() {
    this.customElement.reset();
  }

  get isInteractive() {
    if (metadata[this.args.component.tagName] !== undefined) {
      return metadata[this.args.component.tagName].isInteractive;
    } else {
      return true;
    }
  }

  <template>
    <div class="element-custom">
      {{#if this.isInteractive}}
        <fieldset>
          <legend>
            <PixIcon @name="leftClick" @plainIcon={{false}} @ariaHidden={{true}} />
            <span>{{t "pages.modulix.interactiveElement.label"}}</span>
          </legend>
          <div {{didInsert this.mountCustomElement}} />
        </fieldset>
      {{else}}
        <div {{didInsert this.mountCustomElement}} />
      {{/if}}

      {{#if this.resetButtonDisplayed}}
        <div class="element-custom__reset">
          <PixButton
            @iconBefore="refresh"
            @variant="tertiary"
            @triggerAction={{this.resetCustomElement}}
            aria-label="{{t 'pages.modulix.buttons.embed.reset.ariaLabel'}}"
          >{{t "pages.modulix.buttons.embed.reset.name"}}</PixButton>
        </div>
      {{/if}}
    </div>
  </template>
}
