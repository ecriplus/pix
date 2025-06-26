import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OrganizationsRoute extends Route {
  @service store;

  async model(params) {
    const organizationToJoin = await this.store.queryRecord('organization-to-join', { code: params.code });
    const campaign = await this.store.queryRecord('campaign', { filter: { code: params.code } });

    return { organizationToJoin, campaign };
  }
}
