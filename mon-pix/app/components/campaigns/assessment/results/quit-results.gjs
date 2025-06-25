import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

export default class QuitResults extends Component {
  @service currentUser;
  @service router;
  @service session;

  @tracked showSendResultModal = false;
  @tracked showLeaveWithoutSignupModal = false;

  get shouldShareCampaignResults() {
    return this.args.isSharableCampaign && !this.args.isCampaignShared;
  }

  get isUserAnonymous() {
    return Boolean(this.currentUser.user?.isAnonymous);
  }

  @action
  toggleSendResultModal() {
    this.showSendResultModal = !this.showSendResultModal;
  }

  @action
  toggleSignUpModal() {
    this.showLeaveWithoutSignupModal = !this.showLeaveWithoutSignupModal;
  }

  @action
  async goToSignup() {
    await this.session.invalidate();

    return this.router.transitionTo('authentication');
  }

  <template>
    {{#if this.shouldShareCampaignResults}}
      <button class="evaluation-results-header__back-link" type="button" {{on "click" this.toggleSendResultModal}}>
        {{t "pages.skill-review.actions.back-to-pix"}}
      </button>
    {{else}}
      {{#if this.isUserAnonymous}}
        <button class="evaluation-results-header__back-link" type="button" {{on "click" this.toggleSignUpModal}}>
          {{t "pages.skill-review.actions.back-to-pix"}}
        </button>
      {{else}}
        <LinkTo @route="authenticated" class="evaluation-results-header__back-link">
          {{t "pages.skill-review.actions.back-to-pix"}}
        </LinkTo>
      {{/if}}
    {{/if}}
    <PixModal
      @title={{t "pages.evaluation-results.quit-results.send-result-modal.title"}}
      @onCloseButtonClick={{this.toggleSendResultModal}}
      @showModal={{this.showSendResultModal}}
    >
      <:content>
        <p class="quit-results__first-paragraph">{{t
            "pages.evaluation-results.quit-results.send-result-modal.content-information"
          }}</p>
        <p><strong>{{t "pages.evaluation-results.quit-results.send-result-modal.content-instruction"}}</strong></p>
      </:content>

      <:footer>
        <div class="quit-results__footer">
          <PixButton @variant="secondary" @triggerAction={{this.toggleSendResultModal}}>
            {{t "pages.evaluation-results.quit-results.send-result-modal.actions.cancel-to-share"}}
          </PixButton>

          <PixButtonLink @route="authenticated" @variant="primary">
            {{t "pages.evaluation-results.quit-results.send-result-modal.actions.quit-without-sharing"}}
          </PixButtonLink>
        </div>
      </:footer>
    </PixModal>

    <PixModal
      @title={{t "pages.evaluation-results.quit-results.leave-without-signup-modal.title"}}
      @onCloseButtonClick={{this.toggleSignUpModal}}
      @showModal={{this.showLeaveWithoutSignupModal}}
    >
      <:content>
        <p class="quit-results__first-paragraph">{{t
            "pages.evaluation-results.quit-results.leave-without-signup-modal.content-information"
          }}</p>
        <p><strong>{{t
              "pages.evaluation-results.quit-results.leave-without-signup-modal.content-instruction"
            }}</strong></p>
      </:content>

      <:footer>
        <div class="quit-results__footer">
          <PixButton @variant="secondary" @triggerAction={{this.toggleSignUpModal}}>
            {{t "pages.evaluation-results.quit-results.leave-without-signup-modal.actions.cancel"}}
          </PixButton>

          <PixButton @triggerAction={{this.goToSignup}} @variant="primary">
            {{t "pages.evaluation-results.quit-results.leave-without-signup-modal.actions.leave"}}
          </PixButton>
        </div>
      </:footer>
    </PixModal>
  </template>
}
