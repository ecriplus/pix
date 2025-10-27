import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class NewRoute extends Route {
  @service router;
  @service store;
  @service accessControl;

  queryParams = {
    parentOrganizationId: { refreshModel: true },
    parentOrganizationName: { refreshModel: true },
  };

  beforeModel(transition) {
    this.accessControl.restrictAccessTo(['isSuperAdmin', 'isSupport', 'isMetier'], 'authenticated');
    const queryParams = transition.to.queryParams;

    if (_hasParentOrganizationQueryParamsAndOneIsMissing(queryParams)) {
      this.router.replaceWith('authenticated', {
        queryParams: {
          parentOrganizationId: null,
          parentOrganizationName: null,
        },
      });
    }
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

function _hasParentOrganizationQueryParamsAndOneIsMissing(queryParams) {
  return (
    Object.keys(queryParams).length > 0 &&
    (Boolean(!queryParams.parentOrganizationName && queryParams.parentOrganizationId) ||
      Boolean(queryParams.parentOrganizationName && !queryParams.parentOrganizationId))
  );
}
