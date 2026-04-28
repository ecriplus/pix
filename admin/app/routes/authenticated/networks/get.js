import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class GetRoute extends Route {
  @service store;
  @service router;

  async model(params) {
    try {
      return await this.store.findRecord('network', params.network_id);
    } catch {
      this.router.replaceWith('authenticated.networks.list');
    }
  }
}
