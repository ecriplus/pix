import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MissionLearnersRoute extends Route {
  @service currentUser;
  @service router;
  @service store;

  queryParams = {
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
    }
  }
  async model(params) {
    const organizationId = this.currentUser.organization.id;
    const mission = this.modelFor('authenticated.missions.details');
    const missionLearners = this.store.query(
      'mission-learner',
      {
        organizationId,
        page: {
          number: params.pageNumber,
          size: params.pageSize,
        },
      },
      { reload: true },
    );
    return { missionLearners, mission };
  }
}
