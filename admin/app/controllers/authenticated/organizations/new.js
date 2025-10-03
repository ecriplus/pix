import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class NewController extends Controller {
  @service pixToast;
  @service router;
  @service intl;

  @action
  goBackToOrganizationList() {
    this.router.transitionTo('authenticated.organizations');
  }

  @action
  async addOrganization(event) {
    event.preventDefault();

    if (!this.model.name || !this.model.type || !this.model.administrationTeamId) {
      this.pixToast.sendErrorNotification({
        message: this.intl.t('components.organizations.creation.administration-team.required-fields-error'),
      });
      return;
    }

    try {
      await this.model.save();
      this.pixToast.sendSuccessNotification({ message: 'L’organisation a été créée avec succès.' });
      this.router.transitionTo('authenticated.organizations.get.all-tags', this.model.id);
    } catch {
      this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }
  }
}
