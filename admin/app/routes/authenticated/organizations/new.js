import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

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

  async model(_, transition) {
    const administrationTeams = await this.store.findAll('administration-team');
    const countries = await this.store.findAll('country');
    let parentOrganization = null;
    const { parentOrganizationId } = transition.to.queryParams;
    if (parentOrganizationId) {
      parentOrganization = await this.store.findRecord('organization', parentOrganizationId);
    }
    return RSVP.hash({
      administrationTeams,
      countries,
      parentOrganization,
    });
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
