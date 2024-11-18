import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class NewController extends Controller {
  @service pixToast;
  @service store;
  @service router;

  @action
  goBackToTargetProfileList() {
    this.router.transitionTo('authenticated.target-profiles.list');
  }

  @action
  async createTargetProfile(event, selectedTubes) {
    event.preventDefault();
    const targetProfile = this.model.targetProfile;

    if (selectedTubes === 0) {
      this.pixToast.sendErrorNotification({ message: 'Aucun sujet sélectionné !' });
      return;
    }

    try {
      await targetProfile.save({ adapterOptions: { tubes: selectedTubes } });
      this.pixToast.sendSuccessNotification({ message: 'Le profil cible a été créé avec succès.' });
      this.router.transitionTo('authenticated.target-profiles.target-profile', targetProfile.id);
    } catch (error) {
      this._handleResponseError(error);
    }
  }

  _handleResponseError({ errors }) {
    if (!errors) {
      return this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }
    errors.forEach((error) => {
      if (['404', '412', '422'].includes(error.status)) {
        return this.pixToast.sendErrorNotification({ message: error.detail });
      }
      return this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    });
  }
}
