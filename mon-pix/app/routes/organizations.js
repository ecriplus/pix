import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OrganizationsRoute extends Route {
  @service store;

  beforeModel(transition) {
    if (!transition.from) {
      return this.router.replaceWith('campaigns.entry-point');
    }
  }

  async model(params) {
    const organizationToJoin = await this.store.queryRecord('organization-to-join', { code: params.code });
    const verifiedCode = await this.store.findRecord('verified-code', params.code);

    return { organizationToJoin, verifiedCode };
  }
}
