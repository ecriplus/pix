import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class New extends Route {
  @service accessControl;
  @service store;
  @service router;

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin', 'isMetier'], 'authenticated');
  }

  async model() {
    const organization = await this.modelFor('authenticated.organizations.get');

    return this.store.createRecord('organization-place', { organizationId: organization.id });
  }

  async afterModel() {
    const organization = await this.modelFor('authenticated.organizations.get');

    if (!organization.isPlacesManagementEnabled) {
      this.router.replaceWith('authenticated.organizations.get.team');
    }
  }
}
