import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { not } from 'ember-truth-helpers';

import ConfirmPopup from '../../confirm-popup';

export default class CertificationsHeader extends Component {
  @service accessControl;

  @tracked isModalDisplayed = false;
  @tracked confirmMessage = null;

  get canPublish() {
    // isCancelled will be removed
    return (
      !this.args.juryCertificationSummaries.some(
        (certification) => certification.status === 'error' && !certification.isCancelled,
      ) && this.args.session.isFinalized
    );
  }

  @action
  displayConfirmationModal() {
    this.confirmMessage = this.args.session.isPublished
      ? 'Souhaitez-vous dépublier la session ?'
      : 'Souhaitez-vous publier la session ?';
    this.isModalDisplayed = true;
  }

  @action
  onModalCancel() {
    this.isModalDisplayed = false;
  }

  @action
  async toggleSessionPublication() {
    if (this.args.session.isPublished) {
      await this.args.unpublishSession();
    } else {
      await this.args.publishSession();
    }
    this.isModalDisplayed = false;
  }

  <template>
    <header class="certification-list-page__header">
      <h2>Certifications</h2>
      {{#if this.accessControl.hasAccessToCertificationActionsScope}}
        <div class="btn-group" role="group">

          {{#if @session.isPublished}}
            <PixButton @triggerAction={{this.displayConfirmationModal}}>Dépublier la session</PixButton>
          {{else}}
            <PixTooltip @position="left" @isWide={{true}} @hide={{this.canPublish}}>
              <:triggerElement>
                <PixButton @triggerAction={{this.displayConfirmationModal}} @isDisabled={{not this.canPublish}}>
                  Publier la session
                </PixButton>
              </:triggerElement>
              <:tooltip>
                Vous ne pouvez pas publier la session tant qu'elle n'est pas finalisée ou qu'il reste des certifications
                en erreur.
              </:tooltip>
            </PixTooltip>
          {{/if}}
        </div>
      {{/if}}
    </header>

    <ConfirmPopup
      @message={{this.confirmMessage}}
      @confirm={{this.toggleSessionPublication}}
      @cancel={{this.onModalCancel}}
      @show={{this.isModalDisplayed}}
    />
  </template>
}
