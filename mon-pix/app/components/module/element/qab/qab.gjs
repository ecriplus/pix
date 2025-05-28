import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import QabProposalButton from 'mon-pix/components/module/element/qab/proposal-button';
import QabCard from 'mon-pix/components/module/element/qab/qab-card';

import { htmlUnsafe } from '../../../../helpers/html-unsafe';
import ModuleElement from '../module-element';

export const NEXT_CARD_DELAY = 2000;

export default class ModuleQab extends ModuleElement {
  @tracked selectedOption = null;
  @tracked currentCardStatus = '';
  @tracked currentCardIndex = 0;

  get currentCard() {
    return this.element.cards[this.currentCardIndex];
  }

  @action
  isProposalSolution(option) {
    return this.currentCard.solution === option;
  }

  @action
  isProposalSelected(option) {
    return this.selectedOption === option;
  }

  get isAnswered() {
    return this.selectedOption !== null;
  }

  @action
  goToNextCard() {
    if (this.currentCardIndex + 1 < this.element.cards.length) {
      this.currentCardIndex++;
      this.currentCardStatus = '';
      this.selectedOption = null;
    }
  }

  @action
  onSubmit(event) {
    event.preventDefault();
    this.selectedOption = event.submitter.value;
    this.currentCardStatus = this.selectedOption === this.currentCard.solution ? 'success' : 'error';
    window.setTimeout(() => this.goToNextCard(), NEXT_CARD_DELAY);
  }

  <template>
    <form onSubmit={{this.onSubmit}} class="element-qab" aria-describedby="instruction-{{this.element.id}}">
      <fieldset class="element-qab__container">
        <div class="element-qab__instruction" id="instruction-{{this.element.id}}">
          {{htmlUnsafe this.element.instruction}}
        </div>
        <div class="element-qab__cards">
          <QabCard @card={{this.currentCard}} @status={{this.currentCardStatus}} />
        </div>
        <div class="element-qab__proposals">
          <QabProposalButton
            @text={{this.currentCard.proposalA}}
            @option="A"
            @isSolution={{this.isProposalSolution "A"}}
            @isSelected={{this.isProposalSelected "A"}}
            @isDisabled={{this.isAnswered}}
          />
          <QabProposalButton
            @text={{this.currentCard.proposalB}}
            @option="B"
            @isSolution={{this.isProposalSolution "B"}}
            @isSelected={{this.isProposalSelected "B"}}
            @isDisabled={{this.isAnswered}}
          />
        </div>
      </fieldset>
    </form>
  </template>
}
