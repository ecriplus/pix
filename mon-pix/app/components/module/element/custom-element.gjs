import { element } from 'ember-element-helper';

import ModuleElement from './module-element';

export default class ModulixCustomElement extends ModuleElement {
  <template>
    <div class="element-custom">
      {{#let (element @component.tagName) as |Tag|}}
        <Tag props={{@component.props}} />
      {{/let}}
    </div>
  </template>
}
