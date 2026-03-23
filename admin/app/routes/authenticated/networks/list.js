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
    return this.store.query('network', { filter: { name: params.name ? params.name.trim() : '' } });
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.name = null;
    }
  }
}
