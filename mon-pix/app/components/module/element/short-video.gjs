import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { htmlUnsafe } from 'mon-pix/helpers/html-unsafe';

import ModuleElement from './module-element';

export default class ModulixShortVideoElement extends ModuleElement {
  @tracked modalIsOpen = false;

  @action
  showModal() {
    this.modalIsOpen = true;
    this.args.onTranscriptionOpen(this.args.element.id);
  }

  @action
  closeModal() {
    this.modalIsOpen = false;
  }

  <template>
    <div class="element-short-video">
      <video autoplay loop muted src={{@element.url}}></video>
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
