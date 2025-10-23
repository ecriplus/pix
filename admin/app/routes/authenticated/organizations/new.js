import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class NewRoute extends Route {
  @service store;
  @service accessControl;

  queryParams = {
    parentOrganizationId: { refreshModel: true },
    parentOrganizationName: { refreshModel: true },
  };

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin', 'isSupport', 'isMetier'], 'authenticated');
  }

  model() {
    return this.store.createRecord('organization');
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.parentOrganizationId = null;
      controller.parentOrganizationName = null;
    }
  }
}
