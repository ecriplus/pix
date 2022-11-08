import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class InvitationsController extends Controller {
  @service notifications;
  @service store;
  @service accessControl;

  @action
  async cancelCertificationCenterInvitation(certificationCenterInvitation) {
    try {
      await certificationCenterInvitation.destroyRecord({
        adapterOptions: {
          certificationCenterInvitationId: certificationCenterInvitation.id,
          certificationCenterId: this.model.certificationCenter.id,
        },
      });
      this.notifications.success(`Cette invitation a bien été annulée.`);
    } catch (error) {
      console.error(error);
      this.notifications.error('Une erreur s’est produite, veuillez réessayer.');
    }
  }
}
