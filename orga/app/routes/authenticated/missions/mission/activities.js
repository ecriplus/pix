import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MissionActivitiesRoute extends Route {
  @service currentUser;
  @service router;
  @service store;

  queryParams = {
    divisions: { refreshModel: true },
    name: { refreshModel: true },
    statuses: { refreshModel: true },
    pageNumber: {
      refreshModel: true,
    },
    pageSize: {
      refreshModel: true,
    },
  };

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.pageNumber = 1;
      controller.pageSize = 25;
      controller.divisions = undefined;
      controller.name = undefined;
    }
  }

  async model(params) {
    const organization = this.currentUser.organization;
    const missionModel = this.modelFor('authenticated.missions.mission');
    const missionLearners = await this.store.query(
      'mission-learner',
      {
        organizationId: organization.id,
        missionId: missionModel.mission.id,
        filter: {
          divisions: params.divisions,
          name: params.name,
          statuses: params.statuses,
        },
        page: {
          number: params.pageNumber,
          size: params.pageSize,
        },
      },
      { reload: true },
    );

    return { missionLearners, mission: missionModel, organization };
  }
}
