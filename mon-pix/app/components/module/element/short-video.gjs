import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { htmlUnsafe } from 'mon-pix/helpers/html-unsafe';

import ModuleElement from './module-element';

export default class ModulixShortVideoElement extends ModuleElement {
  @tracked modalIsOpen = false;
  @service passageEvents;
  @service pixMetrics;

  @action
  showModal() {
    this.modalIsOpen = true;

    this.passageEvents.record({
      type: 'SHORT_VIDEO_TRANSCRIPTION_OPENED',
      data: {
        elementId: this.args.element.id,
      },
    });

    this.pixMetrics.trackEvent('Clic sur le bouton transcription d’une vidéo courte', {
      category: 'Modulix',
      elementId: this.args.element.id,
    });
  }

  @action
  closeModal() {
    this.modalIsOpen = false;
  }

  <template>
    <div class="element-short-video">
      <video class="element-short-video__video" autoplay loop muted={{true}} src={{@element.url}}></video>
      <PixButton @variant="tertiary" @triggerAction={{this.showModal}}>
        {{t "pages.modulix.buttons.element.transcription"}}
      </PixButton>
      <PixModal
        @title={{t "pages.modulix.modals.transcription.title"}}
        @showModal={{this.modalIsOpen}}
        @onCloseButtonClick={{this.closeModal}}
      >
        <:content>
          {{htmlUnsafe @element.transcription}}
        </:content>
      </PixModal>
    </div>
  </template>
}
