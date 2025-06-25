import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class GetRoute extends Route {
  @service oidcIdentityProviders;
  @service store;
  @service router;

  async beforeModel() {
    await this.oidcIdentityProviders.loadAllAvailableIdentityProviders();
  }

  async model(params) {
    try {
      return await this.store.findRecord('organization', params.organization_id, { reload: true });
    } catch {
      this.router.replaceWith('authenticated.organizations.list');
    }
  }
}
