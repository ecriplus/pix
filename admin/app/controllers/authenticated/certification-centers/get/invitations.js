import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import isEmailValid from '../../../../utils/email-validator';

export default class AuthenticatedCertificationCentersGetInvitationsController extends Controller {
  @service accessControl;
  @service intl;
  @service pixToast;
  @service errorResponseHandler;
  @service store;

  @tracked userEmailToInvite = null;
  @tracked userEmailToInviteError;

  CUSTOM_ERROR_MESSAGES = {
    DEFAULT: 'Une erreur s’est produite, veuillez réessayer.',
    STATUS_503: 'Le service d’envoi d’email est momentanément indisponible, veuillez réessayer ultérieurement.',
  };

  @action
  onChangeUserEmailToInvite(event) {
    this.userEmailToInvite = event.target.value;
  }

  @action
  async createInvitation(locale, role) {
    const email = this.userEmailToInvite?.trim();
    if (!this._isEmailToInviteValid(email)) {
      return;
    }

    try {
      await this.store.queryRecord('certification-center-invitation', {
        email,
        locale,
        role,
        certificationCenterId: this.model.certificationCenterId,
      });

      this.pixToast.sendSuccessNotification({ message: `Un email a bien a été envoyé à l'adresse ${email}.` });
      this.userEmailToInvite = null;
    } catch (err) {
      this.errorResponseHandler.notify(err, this.CUSTOM_ERROR_MESSAGES);
    }
  }

  @action
  async sendNewCertificationCenterInvitation(certificationCenterInvitation) {
    const { email, locale, role } = certificationCenterInvitation;

    try {
      await this.store.queryRecord('certification-center-invitation', {
        email,
        locale,
        role,
        certificationCenterId: this.model.certificationCenterId,
      });

      this.pixToast.sendSuccessNotification({
        message: this.intl.t('common.invitations.send-new-confirm', { invitationEmail: email }),
      });
    } catch (err) {
      this.errorResponseHandler.notify(err, this.CUSTOM_ERROR_MESSAGES);
    }
  }

  _isEmailToInviteValid(email) {
    if (!email) {
      this.userEmailToInviteError = 'Ce champ est requis.';
      return false;
    }

    if (!isEmailValid(email)) {
      this.userEmailToInviteError = "L'adresse e-mail saisie n'est pas valide.";
      return false;
    }

    this.userEmailToInviteError = null;
    return true;
  }

  @action
  async cancelCertificationCenterInvitation(certificationCenterInvitation) {
    try {
      await certificationCenterInvitation.destroyRecord({
        adapterOptions: {
          certificationCenterInvitationId: certificationCenterInvitation.id,
        },
      });
      this.pixToast.sendSuccessNotification({ message: 'Cette invitation a bien été annulée.' });
    } catch {
      this.pixToast.sendErrorNotification({ message: 'Une erreur s’est produite, veuillez réessayer.' });
    }
  }
}
