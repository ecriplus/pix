import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PreselectTargetProfileRoute extends Route {
  @service currentUser;
  @service store;

  async model() {
    const organization = await this.currentUser.organization;
    const frameworks = await this.store.findAll('framework', { adapterOptions: { organizationId: organization.id } });

    return {
      organization,
      frameworks,
    };
  }
}
