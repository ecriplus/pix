import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import t from 'ember-intl/helpers/t';

export default class AssessmentBanner extends Component {
  <template>
    <div class="assessment-banner">
      <header class="assessment-banner-container" role="banner">
        <img class="assessment-banner__pix-logo" src="/images/pix-logo-blanc.svg" alt="{{t 'common.pix'}}" />
        {{#if @title}}
          <div class="assessment-banner__splitter"></div>
          <h1 class="assessment-banner__title">
            <span class="sr-only"> {{t "pages.assessment-banner.title"}} </span>
            {{@title}}
          </h1>
        {{/if}}
        <div class="assessment-banner__actions">
          {{#if this.showTextToSpeechActivationButton}}
            <PixTooltip class="assessment-banner__text-to-speech-toggle" @position="left" @isInline={{true}}>
              <:triggerElement>
                <button type="button" aria-label={{this.textToSpeechTooltipText}} {{on "click" @toggleTextToSpeech}}>
                  <PixIcon @name={{if @isTextToSpeechActivated "volumeOn" "volumeOff"}} />
                </button>
              </:triggerElement>
              <:tooltip>
                {{this.textToSpeechTooltipText}}
              </:tooltip>
            </PixTooltip>
          {{/if}}
          {{#if @displayHomeLink}}
            <button type="button" class="assessment-banner__home-link" onclick={{this.toggleClosingModal}}>
              {{t "common.actions.quit"}}
              <PixIcon @name="logout" @ariaHidden={{true}} />
            </button>
            <PixModal
              class="assessment-banner__closing-modal"
              @title={{t "pages.assessment-banner.modal.title"}}
              @showModal={{this.showClosingModal}}
              @onCloseButtonClick={{this.toggleClosingModal}}
            >
              <:content>
                <p>{{t "pages.assessment-banner.modal.content"}}</p>
              </:content>
              <:footer>
                <div class="assessment-banner-closing-modal__footer">
                  <PixButton @variant="secondary" @triggerAction={{this.toggleClosingModal}}>
                    {{t "common.actions.stay"}}
                  </PixButton>
                  <PixButtonLink
                    @route="authenticated"
                    aria-label={{t "pages.assessment-banner.modal.actions.quit.extra-information"}}
                  >
                    {{t "common.actions.quit"}}
                  </PixButtonLink>
                </div>
              </:footer>
            </PixModal>
          {{/if}}
        </div>
      </header>
    </div>
  </template>
  @service intl;
  @service featureToggles;

  @tracked showClosingModal = false;

  get textToSpeechTooltipText() {
    return this.args.isTextToSpeechActivated
      ? this.intl.t('pages.challenge.statement.text-to-speech.deactivate')
      : this.intl.t('pages.challenge.statement.text-to-speech.activate');
  }

  get showTextToSpeechActivationButton() {
    return (
      this.featureToggles.featureToggles?.isTextToSpeechButtonEnabled &&
      this.args.displayTextToSpeechActivationButton &&
      window.speechSynthesis
    );
  }

  @action toggleClosingModal() {
    this.showClosingModal = !this.showClosingModal;
  }
}
