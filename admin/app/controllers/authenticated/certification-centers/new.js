import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class NewController extends Controller {
  @service pixToast;
  @service router;

  @action
  goBackToCertificationCentersList() {
    this.router.transitionTo('authenticated.certification-centers');
  }

  @action
  async addCertificationCenter(event) {
    event.preventDefault();

    const certificationCenter = this.model.certificationCenter;
    if (!certificationCenter.externalId || !certificationCenter.externalId.trim()) {
      certificationCenter.externalId = null;
    }

    try {
      await certificationCenter.save();
      this.pixToast.sendSuccessNotification({ message: 'Le centre de certification a été créé avec succès.' });
      this.router.transitionTo('authenticated.certification-centers.get', certificationCenter.id);
    } catch {
      this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }
  }
}
