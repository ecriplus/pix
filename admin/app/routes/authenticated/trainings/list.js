import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isEmpty from 'lodash/isEmpty';

export default class ListRoute extends Route {
  @service accessControl;
  @service pixToast;
  @service store;

  queryParams = {
    pageNumber: { refreshModel: true },
    pageSize: { refreshModel: true },
    id: { refreshModel: true },
    internalTitle: { refreshModel: true },
  };

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin', 'isSupport', 'isMetier'], 'authenticated');
  }

  async model(params) {
    let trainingSummaries;

    try {
      trainingSummaries = await this.store.query('training-summary', {
        filter: {
          id: params.id ? params.id.trim() : '',
          internalTitle: params.internalTitle ? params.internalTitle.trim() : '',
        },
        page: {
          number: params.pageNumber,
          size: params.pageSize,
        },
      });
    } catch (errorResponse) {
      if (!isEmpty(errorResponse)) {
        errorResponse.errors.forEach((error) => this.pixToast.sendErrorNotification({ message: error.detail }));
      }
      return [];
    }
    return trainingSummaries;
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.pageNumber = 1;
      controller.pageSize = 10;
      controller.id = null;
      controller.internalTitle = null;
    }
  }
}
