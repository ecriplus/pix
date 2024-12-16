import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const DEFAULT_PAGE_NUMBER = 1;
export default class ListController extends Controller {
  @service pixToast;
  @service store;

  @tracked pageNumber = DEFAULT_PAGE_NUMBER;
  @tracked pageSize = 10;

  get sortedCertificationJurySummaries() {
    return this.model.juryCertificationSummaries
      .sortBy('numberOfCertificationIssueReportsWithRequiredAction')
      .reverse();
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
  async publishSession() {
    try {
      await this.model.session.save({ adapterOptions: { updatePublishedCertifications: true, toPublish: true } });
    } catch (e) {
      this.notifyError(e);
    } finally {
      await this.forceRefreshModelFromBackend();
    }

    await this.model.juryCertificationSummaries.reload();
    if (this.model.session.isPublished) {
      this.pixToast.sendSuccessNotification({ message: 'Les certifications ont été correctement publiées.' });
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
