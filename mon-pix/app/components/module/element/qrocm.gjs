import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { fn, get } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { eq } from 'ember-truth-helpers';
import ModuleElement from 'mon-pix/components/module/element/module-element';
import ModulixFeedback from 'mon-pix/components/module/feedback';
import htmlUnsafe from 'mon-pix/helpers/html-unsafe';

export default class ModuleQrocm extends ModuleElement {
  @tracked selectedValues = {};

  @service passageEvents;

  constructor() {
    super(...arguments);

    this.element.proposals.forEach((proposal) => {
      if (proposal.defaultValue) {
        this.selectedValues[proposal.input] = proposal.defaultValue;
      }
    });
  }

  get canValidateElement() {
    return this.element.proposals
      .filter(({ type }) => ['input', 'select'].includes(type))
      .every(({ input }) => {
        return !!this.selectedValues?.[input];
      });
  }

  get userResponse() {
    return Object.entries(this.selectedValues).map(([input, answer]) => {
      return {
        input,
        answer,
      };
    });
  }

  resetAnswers() {
    this.selectedValues = {};
  }

  get formattedProposals() {
    return this.element.proposals.map((proposal) => {
      if (proposal.type === 'select') {
        return {
          ...proposal,
          options: proposal.options.map((option) => ({ value: option.id, label: option.content })),
        };
      }
      return proposal;
    });
  }

  get nbOfProposals() {
    return this.element.proposals.filter(({ type }) => type !== 'text').length;
  }

  @action
  onInputChanged(block, { target }) {
    this.#updateSelectedValues(block, target.value);
  }

  @action
  onSelectChanged(block, value) {
    this.#updateSelectedValues(block, value);
  }

  @action
  async onAnswer(event) {
    await super.onAnswer(event);

    const status = this.answerIsValid ? 'ok' : 'ko';
    this.passageEvents.record({
      type: 'QROCM_ANSWERED',
      data: { answer: this.userResponse, elementId: this.element.id, status },
    });
  }

  #updateSelectedValues(block, value) {
    this.selectedValues = {
      ...this.selectedValues,
      [block.input]: value,
    };
  }

  <template>
    <form
      class="element-qrocm"
      aria-describedby="instruction-{{this.element.id}}"
      autocapitalize="off"
      autocomplete="nope"
      autocorrect="off"
      spellcheck="false"
    >
      <fieldset>
        <legend class="screen-reader-only">
          {{t "pages.modulix.qrocm.direction" count=this.nbOfProposals}}
        </legend>

        <div class="element-qrocm__instruction" id="instruction-{{this.element.id}}">
          {{htmlUnsafe this.element.instruction}}
        </div>

        <p class="element-qrocm__direction" aria-hidden="true">
          {{t "pages.modulix.qrocm.direction" count=this.nbOfProposals}}
        </p>

        <div class="element-qrocm__proposals">
          {{#each this.formattedProposals as |block|}}
            {{#if (eq block.type "text")}}
              {{htmlUnsafe block.content}}
            {{/if}}
            {{#if (eq block.type "input")}}
              <div class="element-qrocm-proposals__input element-qrocm-proposals__input--{{block.display}}">
                {{#if (eq block.inputType "text")}}
                  <PixInput
                    @type="text"
                    @value={{get this.selectedValues block.input}}
                    @id={{block.input}}
                    placeholder={{block.placeholder}}
                    @screenReaderOnly={{true}}
                    {{on "change" (fn this.onInputChanged block)}}
                    size={{block.size}}
                    readonly={{this.disableInput}}
                  >
                    <:label>{{block.ariaLabel}}</:label>
                  </PixInput>
                {{else if (eq block.inputType "number")}}
                  <PixInput
                    type="number"
                    @value={{get this.selectedValues block.input}}
                    @id={{block.input}}
                    placeholder={{block.placeholder}}
                    @screenReaderOnly={{true}}
                    {{on "change" (fn this.onInputChanged block)}}
                    size={{block.size}}
                    readonly={{this.disableInput}}
                  >
                    <:label>{{block.ariaLabel}}</:label>
                  </PixInput>
                {{/if}}
              </div>
            {{else if (eq block.type "select")}}
              <div class="element-qrocm-proposals__input element-qrocm-proposals__input--{{block.display}}">
                <PixSelect
                  @value={{get this.selectedValues block.input}}
                  @placeholder={{block.placeholder}}
                  @options={{block.options}}
                  @hideDefaultOption={{true}}
                  @onChange={{fn this.onSelectChanged block}}
                  @screenReaderOnly={{true}}
                  @isDisabled={{this.disableInput}}
                >
                  <:label>{{block.ariaLabel}}</:label>
                </PixSelect>
              </div>
            {{/if}}
          {{/each}}
        </div>
      </fieldset>

      {{#if this.shouldDisplayRequiredMessage}}
        <div class="element-qrocm__required-field-missing">
          <PixNotificationAlert role="alert" @type="error" @withIcon={{true}}>
            {{t "pages.modulix.verification-precondition-failed-alert.qrocm"}}
          </PixNotificationAlert>
        </div>
      {{/if}}

      {{#unless this.correction}}
        <PixButton
          @variant="success"
          @type="submit"
          class="element-qrocm__verify-button"
          @triggerAction={{this.onAnswer}}
        >
          {{t "pages.modulix.buttons.activity.verify"}}
        </PixButton>
      {{/unless}}

      <div class="element-qrocm__feedback" role="status" tabindex="-1">
        {{#if this.shouldDisplayFeedback}}
          <ModulixFeedback @answerIsValid={{this.answerIsValid}} @feedback={{this.correction.feedback}} />
        {{/if}}
      </div>

      {{#if this.shouldDisplayRetryButton}}
        <PixButton
          class="element-qrocm__retry-button"
          @variant="tertiary"
          @size="small"
          @type="button"
          @triggerAction={{this.retry}}
          @iconBefore="refresh"
        >
          {{t "pages.modulix.buttons.activity.retry"}}
        </PixButton>
      {{/if}}
    </form>
  </template>
}
