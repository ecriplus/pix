import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { htmlUnsafe } from 'mon-pix/helpers/html-unsafe';
export default class ModulixAudio extends Component {
  @tracked modalIsOpen = false;

  @service passageEvents;

  @action
  onPlay() {
    this.passageEvents.record({
      type: 'AUDIO_PLAYED',
      data: {
        elementId: this.args.audio.id,
      },
    });
  }

  @action
  showModal() {
    this.modalIsOpen = true;

    this.passageEvents.record({
      type: 'AUDIO_TRANSCRIPTION_OPENED',
      data: {
        elementId: this.args.audio.id,
      },
    });
  }

  @action
  closeModal() {
    this.modalIsOpen = false;
  }
  get hasTranscription() {
    return this.args.audio.transcription.length > 0;
  }

  <template>
    <div class="element-audio">
      <div class="element-audio__container">
        <p class="element-audio__container__title">{{@audio.title}}</p>
        {{! template-lint-disable require-media-caption }}
        <audio
          id={{@audio.id}}
          ref="audio"
          class="pix-audio-player"
          controls
          src="{{@audio.url}}"
          {{on "play" this.onPlay}}
        ></audio>

        {{#if this.hasTranscription}}
          <PixButton @variant="tertiary" @triggerAction={{this.showModal}}>
            {{t "pages.modulix.buttons.element.transcription"}}
          </PixButton>
          <PixModal
            @title={{t "pages.modulix.modals.transcription.title"}}
            @showModal={{this.modalIsOpen}}
            @onCloseButtonClick={{this.closeModal}}
          >
            <:content>
              {{htmlUnsafe @audio.transcription}}
            </:content>
          </PixModal>
        {{/if}}

      </div>
    </div>
  </template>
}
