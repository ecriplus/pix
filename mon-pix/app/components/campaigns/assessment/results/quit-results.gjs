import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

export default class QuitResults extends Component {
  @tracked showSendResultModal = false;

  get shouldShareCampaignResults() {
    return this.args.isSharableCampaign && !this.args.isCampaignShared;
  }

  @action
  toggleSendResultModal() {
    this.showSendResultModal = !this.showSendResultModal;
  }

  <template>
    {{#if this.shouldShareCampaignResults}}
      <button class="evaluation-results-header__back-link" type="button" {{on "click" this.toggleSendResultModal}}>
        {{t "pages.skill-review.actions.back-to-pix"}}
      </button>
    {{else}}
      <LinkTo @route="authenticated" class="evaluation-results-header__back-link">
        {{t "pages.skill-review.actions.back-to-pix"}}
      </LinkTo>
    {{/if}}
    <PixModal
      @title={{t "pages.evaluation-results.quit-results.modal.title"}}
      @onCloseButtonClick={{this.toggleSendResultModal}}
      @showModal={{this.showSendResultModal}}
    >
      <:content>
        <p class="quit-results__first-paragraph">{{t
            "pages.evaluation-results.quit-results.modal.content-information"
          }}</p>
        <p><strong>{{t "pages.evaluation-results.quit-results.modal.content-instruction"}}</strong></p>
      </:content>

      <:footer>
        <div class="quit-results__footer">
          <PixButton @variant="secondary" @triggerAction={{this.toggleSendResultModal}}>
            {{t "pages.evaluation-results.quit-results.modal.actions.cancel-to-share"}}
          </PixButton>

          <PixButtonLink @href="authenticated" @variant="primary">
            {{t "pages.evaluation-results.quit-results.modal.actions.quit-without-sharing"}}
          </PixButtonLink>
        </div>
      </:footer>
    </PixModal>
  </template>
}
