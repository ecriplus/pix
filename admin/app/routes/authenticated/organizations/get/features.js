import Route from '@ember/routing/route';

export default class OrganizationFeaturesRoute extends Route {
  model() {
    return this.modelFor('authenticated.organizations.get');
  }
}
