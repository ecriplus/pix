import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

import { tracked } from '@glimmer/tracking';

export default class NewController extends Controller {
  @service notifications;
  @service store;
  @service router;

  @tracked isSaving = false;

  @action
  goBackToTargetProfileList() {
    this.store.deleteRecord(this.model.targetProfile);

    this.router.transitionTo('authenticated.target-profiles.list');
  }

  @action
  async createTargetProfile(event) {
    event.preventDefault();
    const targetProfile = this.model.targetProfile;

    if (targetProfile.templateTubes.length === 0) {
      this.notifications.error('Aucun sujets sélectionnés !');
      return;
    }

    try {
      this.isSaving = true;
      await targetProfile.save();

      this.notifications.success('Le profil cible a été créé avec succès.');
      this.router.transitionTo('authenticated.target-profiles.target-profile', targetProfile.id);
    } catch (error) {
      this._handleResponseError(error);
    } finally {
      this.isSaving = false;
    }
  }

  _handleResponseError({ errors }) {
    if (!errors) {
      return this.notifications.error('Une erreur est survenue.');
    }
    errors.forEach((error) => {
      if (['404', '412', '422'].includes(error.status)) {
        return this.notifications.error(error.detail);
      }
      return this.notifications.error('Une erreur est survenue.');
    });
  }
}
