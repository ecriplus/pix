import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import ProposalButton from 'mon-pix/components/module/component/proposal-button';

import { htmlUnsafe } from '../../../helpers/html-unsafe';
import ModuleElement from './module-element';

export default class ModuleQcuDiscovery extends ModuleElement {
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
      type: 'QCU_DISCOVERY_ANSWERED',
      data: {
        elementId: this.element.id,
        answer: this.selectedProposalId,
        status: this.selectedProposalId === this.element.solution ? 'ok' : 'ko',
      },
    });

    await this.args.onAnswer({ element: this.element });
  }

  get isAnswered() {
    return this.selectedProposalId !== null;
  }

  <template>
    <form class="element-qcu-discovery" onSubmit={{this.onAnswer}} aria-describedby="instruction-{{this.element.id}}">
      <fieldset>
        <legend class="screen-reader-only">
          {{t "pages.modulix.qcuDiscovery.direction"}}
        </legend>
        <p class="element-qcu-discovery__instruction" id="instruction-{{this.element.id}}">
          {{htmlUnsafe this.element.instruction}}
        </p>
        <p class="element-qcu-discovery__direction">
          {{t "pages.modulix.qcuDiscovery.direction"}}
        </p>
        <div class="element-qcu-discovery__proposals">
          {{#each this.element.proposals as |proposal|}}
            <ProposalButton
              @proposal={{proposal}}
              @isDisabled={{this.isAnswered}}
              @isSelected={{this.isProposalSelected proposal.id}}
              @isDiscoveryVariant={{true}}
            />
          {{/each}}
        </div>
      </fieldset>
    </form>
    {{#if this.shouldDisplayFeedback}}
      <div class="element-qcu-discovery__feedback" role="status" tabindex="-1">
        {{htmlUnsafe this.selectedProposalFeedback}}
      </div>
    {{/if}}
  </template>
}
