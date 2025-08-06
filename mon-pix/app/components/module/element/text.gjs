import htmlUnsafe from 'mon-pix/helpers/html-unsafe';

import ModuleElement from './module-element';

export default class ModulixText extends ModuleElement {
  <template>
    <div class="element-text">
      {{htmlUnsafe @text.content}}
    </div>
  </template>
}
