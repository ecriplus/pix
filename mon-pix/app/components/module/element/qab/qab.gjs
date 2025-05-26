import { action } from '@ember/object';
import QabProposalButton from 'mon-pix/components/module/element/qab/proposal-button';
import QabCard from 'mon-pix/components/module/element/qab/qab-card';

import { htmlUnsafe } from '../../../../helpers/html-unsafe';
import ModuleElement from '../module-element';

export default class ModuleQab extends ModuleElement {
  get currentCard() {
    return this.element.cards[0];
  }

  <template>
    <form class="element-qab" aria-describedby="instruction-{{this.element.id}}">
      <fieldset>
      <fieldset class="element-qab__container">
        <div class="element-qab__instruction" id="instruction-{{this.element.id}}">
          {{htmlUnsafe this.element.instruction}}
        </div>
        <div class="element-qab__cards">
          <QabCard @card={{this.currentCard}} />
        </div>
        <div class="element-qab__proposals">
          <QabProposalButton @text={{this.currentCard.proposalA}} @option="A" />
          <QabProposalButton @text={{this.currentCard.proposalB}} @option="B" />
        </div>
      </fieldset>
    </form>
  </template>
}
