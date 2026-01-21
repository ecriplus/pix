import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const DEFAULT_PAGE_NUMBER = 1;

export default class TargetProfileOrganizationsController extends Controller {
  queryParams = ['pageNumber', 'pageSize'];
  @service router;
  @service pixToast;
  @service store;

  @tracked pageNumber = DEFAULT_PAGE_NUMBER;
  @tracked pageSize = 10;

  @action
  goToOrganizationPage(organizationId) {
    this.router.transitionTo('authenticated.organizations.get', organizationId);
  }

  @action
  async detachOrganizations(organizationId) {
    const adapter = this.store.adapterFor('target-profile');

    try {
      const detachedOrganizationIds = await adapter.detachOrganizations(this.model.targetProfile.id, [organizationId]);
      const hasDetachedOrganizations = detachedOrganizationIds.length > 0;

      if (hasDetachedOrganizations) {
        const message = 'Organisation(s) détachée(s) avec succès : ' + detachedOrganizationIds.join(', ');
        await this.pixToast.sendSuccessNotification({ message });
        this.router.transitionTo('authenticated.target-profiles.target-profile.organizations');
      }
    } catch {
      return this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }
  }
}
