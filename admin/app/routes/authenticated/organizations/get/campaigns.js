import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OrganizationCampaignsRoute extends Route {
  @service store;

  queryParams = {
    pageNumber: { refreshModel: true },
    pageSize: { refreshModel: true },
  };

  async model(params) {
    const organization = this.modelFor('authenticated.organizations.get');

    const cachedCampaigns = organization.hasMany('campaigns').value();
    if (cachedCampaigns !== null && !params.pageNumber) {
      return { campaigns: cachedCampaigns, organizationId: organization.id };
    }

    const campaigns = await this.store.query('campaign', {
      organizationId: organization.id,
      'page[number]': params.pageNumber ?? 1,
      'page[size]': params.pageSize ?? 10,
    });

    return { campaigns, organizationId: organization.id };
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.pageNumber = 1;
      controller.pageSize = 10;
    }
  }
}
