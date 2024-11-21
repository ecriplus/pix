import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class EditController extends Controller {
  @service pixToast;
  @service store;
  @service router;

  get cappedTubes() {
    return this.model.targetProfile.cappedTubes;
  }

  @action
  async editTargetProfile(event, selectedTubes) {
    const targetProfile = this.model.targetProfile;

    if (!targetProfile.hasLinkedCampaign && selectedTubes.length === 0) {
      this.pixToast.sendErrorNotification({ message: 'Vous devez sélectionner au moins 1 sujet !' });
      return;
    }

    try {
      await targetProfile.save({ adapterOptions: { tubes: selectedTubes } });
      this.pixToast.sendSuccessNotification({ message: 'Le profil cible a été modifié avec succès.' });
      this.router.transitionTo('authenticated.target-profiles.target-profile', targetProfile.id);
    } catch (error) {
      this._handleResponseError(error);
    }
  }

  @action
  goBackToTargetProfilePage() {
    this.router.transitionTo('authenticated.target-profiles.target-profile', this.model.targetProfile.id);
  }

  _handleResponseError({ errors }) {
    if (!errors) {
      return this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }
    errors.forEach((error) => {
      if (['400', '404', '412', '422'].includes(error.status)) {
        return this.pixToast.sendErrorNotification({ message: error.detail });
      }
      return this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    });
  }
}
