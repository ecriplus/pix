import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ListRoute extends Route {
  @service accessControl;
  @service store;

  queryParams = {
    name: { refreshModel: true },
  };

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin'], 'authenticated');
  }

  model(params) {
    if (params.name) {
      return this.store.query('network', { filter: { name: params.name.trim() } });
    }
    return this.store.findAll('network');
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.name = null;
    }
  }
}
