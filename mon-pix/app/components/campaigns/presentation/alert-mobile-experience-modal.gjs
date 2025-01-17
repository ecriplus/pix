import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

export default class AlertMobileExperienceModal extends Component {
  @service media;
  @service url;

  @tracked isModalVisible = this.isMobileDevice;

  get isMobileDevice() {
    return this.media.isMobile;
  }

  @action
  closeModal() {
    this.isModalVisible = false;
  }

  @action
  async goToHomepage() {
    return window.location.replace(this.url.homeUrl);
  }

  <template>
    {{#if this.isMobileDevice}}
      <PixModal
        class="campaign-presentation-mobile-modal"
        @title={{t "pages.campaign-landing.alert-mobile-experience-modal.title"}}
        @showModal={{this.isModalVisible}}
        @onCloseButtonClick={{this.closeModal}}
      >
        <:content>
          <p>{{t "pages.campaign-landing.alert-mobile-experience-modal.content.paragraph1"}}</p>
          <p>{{t "pages.campaign-landing.alert-mobile-experience-modal.content.paragraph2"}}</p>
        </:content>
        <:footer>
          <div class="campaign-presentation-mobile-modal__actions">
            <PixButton @triggerAction={{this.closeModal}}>
              {{t "pages.campaign-landing.alert-mobile-experience-modal.actions.continue"}}
            </PixButton>
            <PixButtonLink @route="authentication" @variant="secondary" @isBorderVisible={{true}}>
              {{t "pages.campaign-landing.alert-mobile-experience-modal.actions.back"}}
            </PixButtonLink>
          </div>
        </:footer>
      </PixModal>
    {{/if}}
  </template>
}
