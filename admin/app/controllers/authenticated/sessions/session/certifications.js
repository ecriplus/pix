import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ListController extends Controller {
  @service pixToast;
  @service store;

  @action
  async publishSession() {
    try {
      await this.model.session.save({ adapterOptions: { updatePublishedCertifications: true, toPublish: true } });
      await this.model.juryCertificationSummaries.reload();
      this.pixToast.sendSuccessNotification({ message: 'Les certifications ont été correctement publiées.' });
    } catch (e) {
      this.notifyError(e);
    } finally {
      await this.forceRefreshModelFromBackend();
    }
  }

  @action
  async unpublishSession() {
    try {
      await this.model.session.save({ adapterOptions: { updatePublishedCertifications: true, toPublish: false } });
      await this.model.juryCertificationSummaries.reload();
      this.pixToast.sendSuccessNotification({ message: 'Les certifications ont été correctement dépubliées.' });
    } catch (e) {
      this.notifyError(e);
    } finally {
      await this.forceRefreshModelFromBackend();
    }
  }

  @action
  notifyError(error) {
    if (error.errors && error.errors[0] && error.errors[0].detail) {
      this.pixToast.sendErrorNotification({ message: error.errors[0].detail });
    } else {
      this.pixToast.sendErrorNotification({ message: error });
    }
  }

  @action
  async forceRefreshModelFromBackend() {
    await this.store.findRecord('session', this.model.session.id, { reload: true });
  }
}
