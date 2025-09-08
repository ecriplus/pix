import PixButton from '@1024pix/pix-ui/components/pix-button';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import Element from 'mon-pix/components/module/component/element';
import ModuleGrain from 'mon-pix/components/module/grain/grain';

import didInsert from '../../../modifiers/modifier-did-insert';

export default class ModulixStep extends Component {
  @service modulixAutoScroll;

  get displayableElements() {
    return this.args.step.elements.filter((element) => ModuleGrain.AVAILABLE_ELEMENT_TYPES.includes(element.type));
  }

  get hasDisplayableElements() {
    return this.displayableElements.length > 0;
  }

  get isLastStep() {
    return this.args.currentStep === this.args.totalSteps;
  }

  @action
  focusAndScroll(htmlElement) {
    if (!this.args.isActive) {
      return;
    }

    this.modulixAutoScroll.focusAndScroll(htmlElement);
  }

  <template>
    {{#if this.hasDisplayableElements}}
      <section
        class="stepper__step {{if this.isLastStep 'stepper-step--last-step'}}"
        tabindex="-1"
        {{didInsert this.focusAndScroll}}
        inert={{if @isHidden true}}
        aria-hidden={{if @isHidden "true"}}
      >
        <h4 class="stepper__step__position screen-reader-only">
          {{t "pages.modulix.stepper.step.position" currentStep=@currentStep totalSteps=@totalSteps}}
        </h4>
        {{#each this.displayableElements as |element|}}
          <div class="grain-card-content__element">
            <Element
              @element={{element}}
              @onElementAnswer={{@onElementAnswer}}
              @onElementRetry={{@onElementRetry}}
              @getLastCorrectionForElement={{@getLastCorrectionForElement}}
              @onImageAlternativeTextOpen={{@onImageAlternativeTextOpen}}
              @onVideoTranscriptionOpen={{@onVideoTranscriptionOpen}}
              @onVideoPlay={{@onVideoPlay}}
              @onFileDownload={{@onFileDownload}}
              @onExpandToggle={{@onExpandToggle}}
            />
          </div>
        {{/each}}
        {{#if @shouldDisplayNextButton}}
          <PixButton
            aria-label="{{t 'pages.modulix.buttons.stepper.next.ariaLabel'}}"
            @variant="primary"
            @triggerAction={{@onNextButtonClick}}
            class="stepper__next-button"
          >{{t "pages.modulix.buttons.stepper.next.name"}}</PixButton>
        {{/if}}
      </section>
    {{/if}}
  </template>
}
