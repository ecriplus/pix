import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import ConfirmPopup from '../../../confirm-popup';

export default class CertificationInformationGlobalActions extends Component {
  @service pixToast;
  @service store;
  @service intl;

  @tracked confirmAction = this.onCancelCertificationConfirmation;
  @tracked confirmErrorMessage = '';
  @tracked confirmMessage = '';
  @tracked displayConfirm = false;
  @tracked modalTitle = null;

  get displayCancelCertificationButton() {
    return Boolean(
      !this.args.certification.isCertificationCancelled &&
        !this.args.certification.isPublished &&
        this.args.session.finalizedAt,
    );
  }

  get displayUncancelCertificationButton() {
    return Boolean(
      this.args.certification.isCertificationCancelled &&
        !this.args.certification.isPublished &&
        this.args.session.finalizedAt,
    );
  }

  get displayRejectCertificationButton() {
    return this.args.certification.status !== 'rejected';
  }

  get displayUnrejectCertificationButton() {
    return this.args.certification.status === 'rejected' && this.args.certification.isRejectedForFraud;
  }

  get displayRescoringCertificationButton() {
    return Boolean(!this.args.certification.isPublished && this.args.session.finalizedAt);
  }

  @action
  onCancelConfirm() {
    this.displayConfirm = false;
  }

  @action
  async onCancelCertificationConfirmation() {
    try {
      await this.args.certification.save({ adapterOptions: { isCertificationCancel: true } });
      await this.args.certification.reload();
    } catch {
      this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }

    this.displayConfirm = false;
  }

  @action
  onCancelCertificationButtonClick() {
    this.modalTitle = "Confirmer l'annulation de la certification";
    this.confirmAction = this.onCancelCertificationConfirmation;
    this.confirmMessage =
      'Êtes-vous sûr·e de vouloir annuler cette certification ? Cliquez sur confirmer pour poursuivre.';
    this.displayConfirm = true;
  }

  @action
  async onUncancelCertificationConfirmation() {
    try {
      await this.args.certification.save({ adapterOptions: { isCertificationUncancel: true } });
      await this.args.certification.reload();
    } catch {
      this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }

    this.displayConfirm = false;
  }

  @action
  onUncancelCertificationButtonClick() {
    this.modalTitle = 'Confirmer la désannulation de la certification';
    this.confirmAction = this.onUncancelCertificationConfirmation;
    this.confirmMessage =
      'Êtes-vous sûr·e de vouloir désannuler cette certification ? Cliquez sur confirmer pour poursuivre.';
    this.displayConfirm = true;
  }

  @action
  async onRejectCertificationConfirmation() {
    try {
      await this.args.certification.save({ adapterOptions: { isCertificationReject: true } });
      await this.args.certification.reload();
    } catch {
      this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }

    this.displayConfirm = false;
  }

  @action
  onRejectCertificationButtonClick() {
    this.modalTitle = 'Confirmer le rejet de la certification';
    this.confirmAction = this.onRejectCertificationConfirmation;
    this.confirmMessage =
      'Êtes-vous sûr·e de vouloir rejeter cette certification ? Cliquez sur confirmer pour poursuivre.';
    this.displayConfirm = true;
  }

  @action
  async onUnrejectCertificationConfirmation() {
    try {
      await this.args.certification.save({ adapterOptions: { isCertificationUnreject: true } });
      await this.args.certification.reload();
    } catch {
      this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }

    this.displayConfirm = false;
  }

  @action
  onUnrejectCertificationButtonClick() {
    this.modalTitle = "Confirmer l'annulation du rejet de la certification";
    this.confirmAction = this.onUnrejectCertificationConfirmation;
    this.confirmMessage =
      'Êtes-vous sûr·e de vouloir annuler le rejet de cette certification ? Cliquez sur confirmer pour poursuivre.';
    this.displayConfirm = true;
  }

  @action
  async rescoreCertification() {
    try {
      const adapter = this.store.adapterFor('certification');
      await adapter.rescoreCertification({
        certificationCourseId: this.args.certification.id,
      });
      this.pixToast.sendSuccessNotification({
        message: this.intl.t('components.certifications.global-actions.rescoring.success-message'),
      });
    } catch {
      this.pixToast.sendErrorNotification({
        message: this.intl.t('components.certifications.global-actions.rescoring.error-message'),
      });
    }
  }

  <template>
    <PixButtonLink @route="authenticated.users.get" @size="small" @model={{@certification.userId}}>
      Voir les détails de l'utilisateur
    </PixButtonLink>

    <div class="certification-informations__row__actions">
      {{#if this.displayCancelCertificationButton}}
        <PixButton @variant="secondary" @size="small" @triggerAction={{this.onCancelCertificationButtonClick}}>
          Annuler la certification
        </PixButton>
      {{/if}}
      {{#if this.displayUncancelCertificationButton}}
        <PixButton @variant="error" @size="small" @triggerAction={{this.onUncancelCertificationButtonClick}}>
          Désannuler la certification
        </PixButton>
      {{/if}}
      {{#if this.displayUnrejectCertificationButton}}
        <PixButton @variant="error" @size="small" @triggerAction={{this.onUnrejectCertificationButtonClick}}>
          Annuler le rejet
        </PixButton>
      {{/if}}
      {{#if this.displayRejectCertificationButton}}
        {{#if @certification.isPublished}}
          <PixTooltip @position="left" @isWide={{true}}>
            <:triggerElement>
              <PixButton
                @variant="error"
                @size="small"
                @triggerAction={{this.onRejectCertificationButtonClick}}
                @isDisabled={{true}}
              >
                Rejeter la certification
              </PixButton>
            </:triggerElement>

            <:tooltip>
              Vous ne pouvez pas rejeter une certification publiée. Merci de dépublier la session avant de rejeter cette
              certification.
            </:tooltip>
          </PixTooltip>
        {{else}}
          <PixButton @variant="error" @size="small" @triggerAction={{this.onRejectCertificationButtonClick}}>
            Rejeter la certification
          </PixButton>
        {{/if}}
      {{/if}}
      {{#if this.displayRescoringCertificationButton}}
        <PixButton @size="small" @triggerAction={{this.rescoreCertification}}>
          {{t "components.certifications.global-actions.rescoring.button"}}
        </PixButton>
      {{/if}}
    </div>

    <ConfirmPopup
      @title={{this.modalTitle}}
      @message={{this.confirmMessage}}
      @error={{this.confirmErrorMessage}}
      @confirm={{this.confirmAction}}
      @show={{this.displayConfirm}}
      @cancel={{this.onCancelConfirm}}
    />
  </template>
}
