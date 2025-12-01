import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class NewController extends Controller {
  @service pixToast;
  @service store;
  @service router;
  @service intl;

  @action
  goToTrainingDetails(trainingId) {
    this.router.transitionTo('authenticated.trainings.training', trainingId);
  }

  @action
  goBackToTrainingList() {
    this.router.transitionTo('authenticated.trainings.list');
  }

  @action
  async createOrUpdateTraining(trainingFormData) {
    try {
      const { id } = await this.store.createRecord('training', trainingFormData).save();
      this.pixToast.sendSuccessNotification({ message: 'Le contenu formatif a été créé avec succès.' });
      this.goToTrainingDetails(id);
    } catch (error) {
      this._handleResponseError(error);
    }
  }

  _handleResponseError({ errors }) {
    if (!errors) {
      return this.pixToast.sendErrorNotification({ message: this.intl.t('common.notifications.generic-error') });
    }
    errors.forEach((error) => {
      if (['400', '404', '412', '422'].includes(error.status)) {
        let message = error.detail;
        if (message.includes('data.attributes.editor-logo-url')) {
          message = this.intl.t('pages.trainings.training.error-messages.incorrect-editor-logo-url-format');
        }
        return this.pixToast.sendErrorNotification({ message });
      }
      return this.pixToast.sendErrorNotification({ message: this.intl.t('common.notifications.generic-error') });
    });
  }
}
