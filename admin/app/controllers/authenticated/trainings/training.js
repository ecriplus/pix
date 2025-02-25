import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class Training extends Controller {
  @service store;
  @service pixToast;
  @service accessControl;
  @service router;
  @service intl;

  @tracked isEditMode = false;

  get canEdit() {
    return this.accessControl.hasAccessToTrainingsActionsScope;
  }

  @action
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  @action
  async updateTraining(trainingFormData) {
    try {
      for (const key in trainingFormData) {
        this.model[key] = trainingFormData[key];
      }
      await this.model.save();
      this.pixToast.sendSuccessNotification({ message: 'Le contenu formatif a été mis à jour avec succès.' });
      this.toggleEditMode();
    } catch {
      this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }
  }

  @action
  async duplicateTraining() {
    try {
      const adapter = this.store.adapterFor('training');
      const { trainingId: newTrainingId } = await adapter.duplicate(this.model.id);
      this.goToNewTrainingDetails(newTrainingId);
      this.pixToast.sendSuccessNotification({
        message: this.intl.t('pages.trainings.training.duplicate.notifications.success'),
      });
    } catch (error) {
      error.errors.forEach((apiError) => {
        this.pixToast.sendErrorNotification({ message: apiError.detail });
      });
    }
  }

  @action
  goToNewTrainingDetails(newTrainingId) {
    this.router.transitionTo('authenticated.trainings.training', newTrainingId);
  }
}
