import Route from '@ember/routing/route';
import { service } from '@ember/service';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

export default class ListRoute extends Route {
  @service accessControl;
  @service store;

  queryParams = {
    pageNumber: { refreshModel: true },
    pageSize: { refreshModel: true },
    name: { refreshModel: true },
  };

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin'], 'authenticated');
  }

  model(params) {
    return this.store.query('network', {
      filter: { name: params.name ? params.name.trim() : '' },
      page: {
        number: params.pageNumber,
        size: params.pageSize,
      },
    });
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.name = null;
      controller.pageNumber = DEFAULT_PAGE_NUMBER;
      controller.pageSize = DEFAULT_PAGE_SIZE;
    }
  }
}
