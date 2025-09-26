import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { htmlUnsafe } from 'mon-pix/helpers/html-unsafe';

export default class ModulixImageElement extends Component {
  @tracked modalIsOpen = false;

  static MAX_WIDTH = 700;

  get hasAlternativeText() {
    return this.args.image.alternativeText.length > 0;
  }

  @action
  showModal() {
    this.modalIsOpen = true;
    this.args.onAlternativeTextOpen(this.args.image.id);
  }

  @action
  closeModal() {
    this.modalIsOpen = false;
  }

  get hasCaption() {
    return this.args.image.legend?.length > 0 || this.args.image.licence?.length > 0;
  }

  get width() {
    if (this.args.image.infos && this.hasDimensions) {
      return ModulixImageElement.MAX_WIDTH;
    }
    return null;
  }

  get height() {
    if (this.args.image.infos && this.hasDimensions) {
      return Math.round((ModulixImageElement.MAX_WIDTH * this.args.image.infos.height) / this.args.image.infos.width);
    }
    return null;
  }

  get hasDimensions() {
    return this.args.image.infos.width > 0 && this.args.image.infos.height > 0;
  }

  <template>
    <div class="element-image">
      <figure class="element-image__container">
        <img
          class="element-image-container__image"
          alt={{@image.alt}}
          src={{@image.url}}
          width={{this.width}}
          height={{this.height}}
        />
        {{#if this.hasCaption}}
          <figcaption class="element-image-container__caption">{{@image.legend}}<span
              class="element-image-container__licence"
            >{{@image.licence}}</span></figcaption>
        {{/if}}
      </figure>
      {{#if this.hasAlternativeText}}
        <PixButton class="element-image__button" @variant="tertiary" @triggerAction={{this.showModal}}>
          {{t "pages.modulix.buttons.element.alternativeText"}}
        </PixButton>
        <PixModal
          @title={{t "pages.modulix.modals.alternativeText.title"}}
          @showModal={{this.modalIsOpen}}
          @onCloseButtonClick={{this.closeModal}}
        >
          <:content>
            {{htmlUnsafe @image.alternativeText}}
          </:content>
        </PixModal>
      {{/if}}
    </div>
  </template>
}
