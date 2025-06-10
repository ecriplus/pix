import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import ProposalButton from 'mon-pix/components/module/component/proposal-button';

import { htmlUnsafe } from '../../../helpers/html-unsafe';
import ModuleElement from './module-element';

export default class ModuleQcuDeclarative extends ModuleElement {
  @tracked selectedProposalId = null;
  @tracked shouldDisplayFeedback = false;
  @service passageEvents;

  get selectedProposalFeedback() {
    return this.element.proposals.find((proposal) => proposal.id === this.selectedProposalId).feedback.diagnosis;
  }

  get selectedProposalAnswer() {
    return this.element.proposals.find((proposal) => proposal.id === this.selectedProposalId).content;
  }

  @action
  isProposalSelected(proposalId) {
    return this.selectedProposalId === proposalId;
  }

  @action
  async onAnswer(event) {
    event.preventDefault();
    this.selectedProposalId = event.submitter.value;
    this.shouldDisplayFeedback = true;
    this.passageEvents.record({
      type: 'QCU_DECLARATIVE_ANSWERED',
      data: {
        elementId: this.element.id,
        answer: this.selectedProposalAnswer,
      },
    });

    await this.args.onAnswer({ element: this.element });
  }

  get isAnswered() {
    return this.selectedProposalId !== null;
  }

  <template>
    <form class="element-qcu-declarative" onSubmit={{this.onAnswer}} aria-describedby="instruction-{{this.element.id}}">
      <fieldset>
        <legend class="screen-reader-only">
          {{t "pages.modulix.qcuDeclarative.direction"}}
        </legend>
        <p class="element-qcu-declarative__instruction" id="instruction-{{this.element.id}}">
          {{htmlUnsafe this.element.instruction}}
        </p>
        <p class="element-qcu-declarative__complementary-instruction">
          {{t "pages.modulix.qcuDeclarative.complementaryInstruction"}}
        </p>
        <div class="element-qcu-declarative__proposals">
          {{#each this.element.proposals as |proposal|}}
            <ProposalButton
              @proposal={{proposal}}
              @isDisabled={{this.isAnswered}}
              @isSelected={{this.isProposalSelected proposal.id}}
            />
          {{/each}}
        </div>
      </fieldset>
    </form>
    {{#if this.shouldDisplayFeedback}}
      <div class="element-qcu-declarative__feedback" role="status" tabindex="-1">
        {{htmlUnsafe this.selectedProposalFeedback}}
      </div>
    {{/if}}
  </template>
}
