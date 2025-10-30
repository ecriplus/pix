import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class NewController extends Controller {
  @service pixToast;
  @service router;
  @service intl;
  @service store;

  queryParams = ['parentOrganizationId', 'parentOrganizationName'];

  @tracked parentOrganizationId = null;
  @tracked parentOrganizationName = null;

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

    if (this.parentOrganizationId) {
      this.model.setProperties({
        parentOrganizationId: this.parentOrganizationId,
      });
    }

    try {
      await this.model.save();
      this.pixToast.sendSuccessNotification({ message: 'L’organisation a été créée avec succès.' });

      if (this.model.parentOrganizationId) {
        const parentOrganization = await this.store.findRecord('organization', this.model.parentOrganizationId);
        await parentOrganization.hasMany('children').reload();
      }

      this.router.transitionTo('authenticated.organizations.get.all-tags', this.model.id);
    } catch {
      this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }
  }
}
