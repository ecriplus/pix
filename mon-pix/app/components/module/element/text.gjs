import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { t } from 'ember-intl';
import htmlUnsafe from 'mon-pix/helpers/html-unsafe';

import ModuleElement from './module-element';

export default class ModulixText extends ModuleElement {
  get contentWithIframe() {
    const expression = /^<iframe/;
    const regExp = new RegExp(expression);
    return regExp.test(this.args.text.content);
  }

  <template>
    <div class="element-text">
      {{#if this.contentWithIframe}}
        <fieldset>
          <legend>
            <PixIcon @name="leftClick" @plainIcon={{false}} @ariaHidden={{true}} />
            <span>{{t "pages.modulix.interactiveElement.label"}}</span>
          </legend>
          {{htmlUnsafe @text.content}}
        </fieldset>
      {{else}}
        {{htmlUnsafe @text.content}}
      {{/if}}
    </div>
  </template>
}
