import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
import { concat } from '@ember/helper';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import Step from 'mon-pix/components/module/component/step';
import ModuleGrain from 'mon-pix/components/module/grain/grain';
import htmlUnsafe from 'mon-pix/helpers/html-unsafe';
import { inc } from 'mon-pix/helpers/inc';

import didInsert from '../../../modifiers/modifier-did-insert';

export default class ModulixStepper extends Component {
  @service modulixAutoScroll;
  @service modulixPreviewMode;

  displayableSteps = this.args.steps.filter((step) =>
    step.elements.some((element) => ModuleGrain.AVAILABLE_ELEMENT_TYPES.includes(element.type)),
  );

  @tracked stepsToDisplay = this._initialStepsToDisplay;
  get _initialStepsToDisplay() {
    const firstDisplayableStep = this.displayableSteps[0];
    return this.modulixPreviewMode.isEnabled ? this.displayableSteps : [firstDisplayableStep];
  }

  @tracked displayedStepIndex = 0;

  @tracked
  preventScrollAndFocus = false;

  @tracked shouldAppearToRight = false;

  @action
  stepIsActive(index) {
    return this.displayedStepIndex === index;
  }

  @action
  stepIsHidden(index) {
    if (this.modulixPreviewMode.isEnabled) {
      return false;
    }

    return !this.stepIsActive(index);
  }

  get hasDisplayableSteps() {
    return this.displayableSteps.length > 0;
  }

  @action
  goBackToPreviousStep() {
    if (this.displayedStepIndex === 0) {
      return;
    }

    this.displayedStepIndex -= 1;
    this.preventScrollAndFocus = true;
  }

  @action
  displayNextStep() {
    const currentStepPosition = this.lastDisplayedStepIndex + 1;
    const nextStep = this.displayableSteps[currentStepPosition];
    this.stepsToDisplay = [...this.stepsToDisplay, nextStep];

    if (!this.hasNextStep) {
      this.args.stepperIsFinished();
    }

    this.args.onStepperNextStep(currentStepPosition);
    this.displayedStepIndex = currentStepPosition;
    this.preventScrollAndFocus = false;
    this.shouldAppearToRight = true;
    setTimeout(() => {
      this.shouldAppearToRight = false;
    }, 0);
  }

  @action
  goBackToNextStep() {
    if (this.isNextButtonControlDisabled) {
      return;
    }

    this.displayedStepIndex++;
    this.preventScrollAndFocus = true;
  }

  get lastDisplayedStepIndex() {
    return this.stepsToDisplay.length - 1;
  }

  get hasNextStep() {
    return this.stepsToDisplay.length < this.displayableSteps.length;
  }

  get answerableElementsInCurrentStep() {
    const currentStep = this.stepsToDisplay[this.lastDisplayedStepIndex];
    return currentStep.elements.filter((element) => element.isAnswerable);
  }

  get allAnswerableElementsAreAnsweredInCurrentStep() {
    return this.answerableElementsInCurrentStep.every((element) => {
      return this.args.passage.getLastCorrectionForElement(element) !== undefined;
    });
  }

  get shouldDisplayNextButton() {
    return this.hasNextStep && this.allAnswerableElementsAreAnsweredInCurrentStep;
  }

  get totalSteps() {
    return this.displayableSteps.length;
  }

  get isHorizontalDirection() {
    return this.args.direction === 'horizontal';
  }

  get isPreviousButtonControlDisabled() {
    return this.displayedStepIndex === 0;
  }

  get isNextButtonControlDisabled() {
    return this.displayedStepIndex === this.lastDisplayedStepIndex;
  }

  get id() {
    return this.args.id || `pix-tabs-${guidFor(this)}`;
  }

  <template>
    <div
      class="stepper stepper--{{@direction}}"
      aria-live="polite"
      aria-roledescription="{{t 'pages.modulix.stepper.aria-role-description'}}"
      {{didInsert this.modulixAutoScroll.setHTMLElementScrollOffsetCssProperty}}
    >
      {{#if this.isHorizontalDirection}}
        <div class="stepper__controls">
          <PixIconButton
            @ariaLabel={{t "pages.modulix.buttons.stepper.controls.previous.ariaLabel"}}
            @iconName="chevronLeft"
            @isDisabled={{this.isPreviousButtonControlDisabled}}
            @triggerAction={{this.goBackToPreviousStep}}
            aria-controls={{this.id}}
          />
          <p
            class="stepper-controls__position"
            aria-label="{{t
              'pages.modulix.stepper.step.position'
              currentStep=(inc this.displayedStepIndex)
              totalSteps=this.totalSteps
            }}"
          >
            {{inc this.displayedStepIndex}}/{{this.totalSteps}}
          </p>
          <PixIconButton
            @ariaLabel={{t "pages.modulix.buttons.stepper.controls.next.ariaLabel"}}
            @iconName="chevronRight"
            @isDisabled={{this.isNextButtonControlDisabled}}
            @triggerAction={{this.goBackToNextStep}}
            aria-controls={{this.id}}
          />
        </div>
        <div
          id={{this.id}}
          class="stepper__steps"
          style={{htmlUnsafe (concat "--current-step-index:" this.displayedStepIndex)}}
        >
          {{#if this.hasDisplayableSteps}}
            {{#each this.stepsToDisplay as |step index|}}
              <Step
                @step={{step}}
                @currentStep={{inc index}}
                @totalSteps={{this.totalSteps}}
                @onElementAnswer={{@onElementAnswer}}
                @onElementRetry={{@onElementRetry}}
                @getLastCorrectionForElement={{@getLastCorrectionForElement}}
                @isActive={{this.stepIsActive index}}
                @isHidden={{this.stepIsHidden index}}
                @onImageAlternativeTextOpen={{@onImageAlternativeTextOpen}}
                @onVideoTranscriptionOpen={{@onVideoTranscriptionOpen}}
                @onVideoPlay={{@onVideoPlay}}
                @onFileDownload={{@onFileDownload}}
                @onExpandToggle={{@onExpandToggle}}
                @onNextButtonClick={{this.displayNextStep}}
                @shouldDisplayNextButton={{this.shouldDisplayNextButton}}
                @preventScrollAndFocus={{this.preventScrollAndFocus}}
                @shouldAppearToRight={{this.shouldAppearToRight}}
              />
            {{/each}}
          {{/if}}
        </div>
      {{else}}
        {{#if this.hasDisplayableSteps}}
          {{#each this.stepsToDisplay as |step index|}}
            <Step
              @step={{step}}
              @currentStep={{inc index}}
              @totalSteps={{this.totalSteps}}
              @onElementAnswer={{@onElementAnswer}}
              @onElementRetry={{@onElementRetry}}
              @getLastCorrectionForElement={{@getLastCorrectionForElement}}
              @isActive={{this.stepIsActive index}}
              @isHidden={{false}}
              @onImageAlternativeTextOpen={{@onImageAlternativeTextOpen}}
              @onVideoTranscriptionOpen={{@onVideoTranscriptionOpen}}
              @onVideoPlay={{@onVideoPlay}}
              @onFileDownload={{@onFileDownload}}
              @onExpandToggle={{@onExpandToggle}}
            />
          {{/each}}
          {{#if this.shouldDisplayNextButton}}
            <PixButton
              aria-label="{{t 'pages.modulix.buttons.stepper.next.ariaLabel'}}"
              @variant="primary"
              @triggerAction={{this.displayNextStep}}
              class="stepper__next-button"
            >{{t "pages.modulix.buttons.stepper.next.name"}}</PixButton>
          {{/if}}
        {{/if}}
      {{/if}}
    </div>
  </template>
}
