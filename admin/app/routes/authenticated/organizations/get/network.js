import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class Network extends Route {
  @service accessControl;
  @service router;

  beforeModel() {
    const organization = this.modelFor('authenticated.organizations.get');

    if (!organization.network.id) {
      this.router.replaceWith('authenticated.organizations.get.details');
    }
  }

  model() {
    const organization = this.modelFor('authenticated.organizations.get');
    return {
      organization,
      children: organization.children,
    };
  }
}
