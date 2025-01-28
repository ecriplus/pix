import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class NewController extends Controller {
  @service pixToast;
  @service router;

  @action
  goBackToOrganizationList() {
    this.router.transitionTo('authenticated.organizations');
  }

  @action
  async addOrganization(event) {
    event.preventDefault();
    try {
      await this.model.save();
      this.pixToast.sendSuccessNotification({ message: 'L’organisation a été créée avec succès.' });
      this.router.transitionTo('authenticated.organizations.get.all-tags', this.model.id);
    } catch {
      this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }
  }
}
