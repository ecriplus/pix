import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CombinedCourseBlueprintDetailsRoute extends Route {
  @service accessControl;
  @service store;

  queryParams = {
    pageNumber: { refreshModel: true },
    pageSize: { refreshModel: true },
    id: { refreshModel: true },
    name: { refreshModel: true },
    type: { refreshModel: true },
    externalId: { refreshModel: true },
    hideArchived: { refreshModel: true },
    administrationTeamId: { refreshModel: true },
  };

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin', 'isSupport', 'isMetier'], 'authenticated');
  }

  async model(params) {
    const blueprint = this.modelFor('authenticated.combined-course-blueprints.combined-course-blueprint');
    const queryParams = {
      page: {
        size: params.pageSize,
        number: params.pageNumber,
      },
      filter: {
        id: params.id,
        name: params.name,
        type: params.type,
        externalId: params.externalId,
        hideArchived: params.hideArchived,
        administrationTeamId: params.administrationTeamId,
        combinedCourseBlueprintId: blueprint.id,
      },
    };
    const administrationTeams = await this.store.findAll('administration-team');
    const organizations = await this.store.query('organization', queryParams);
    return { blueprint, organizations, administrationTeams };
  }
}
