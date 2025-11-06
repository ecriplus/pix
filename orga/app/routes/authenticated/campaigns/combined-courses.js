import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CampaignCombinedCoursesRoute extends Route {
  @service store;
  @service currentUser;
  @service router;
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
    const organization = this.currentUser.organization;
    const combinedCourses = await this.store.query(
      'combined-course',
      {
        organizationId: organization.id,
        page: {
          number: params.pageNumber,
          size: params.pageSize,
        },
      },
      { reload: true },
    );
    return { combinedCourses };
  }
}
