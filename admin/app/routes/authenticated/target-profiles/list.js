import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isEmpty from 'lodash/isEmpty';

export default class ListRoute extends Route {
  @service pixToast;
  @service store;
  @service accessControl;

  queryParams = {
    pageNumber: { refreshModel: true },
    pageSize: { refreshModel: true },
    id: { refreshModel: true },
    internalName: { refreshModel: true },
    categories: { refreshModel: true },
  };

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin', 'isSupport', 'isMetier'], 'authenticated');
  }

  async model(params) {
    let targetProfileSummaries;
    try {
      targetProfileSummaries = await this.store.query('target-profile-summary', {
        filter: {
          id: params.id ? params.id.trim() : '',
          internalName: params.internalName ? params.internalName.trim() : '',
          categories: params.categories ?? [],
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
    return targetProfileSummaries;
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.pageNumber = 1;
      controller.pageSize = 10;
      controller.id = null;
      controller.internalName = null;
      controller.categories = [];
    }
  }
}
