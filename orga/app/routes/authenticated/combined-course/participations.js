import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CombinedCourseRoute extends Route {
  @service store;
  @service router;
  @service currentUser;

  queryParams = {
    pageNumber: { refreshModel: true },
    pageSize: { refreshModel: true },
    fullName: { refreshModel: true },
    statuses: { refreshModel: true },
    divisions: { refreshModel: true },
    groups: { refreshModel: true },
  };

  async model(params) {
    const combinedCourse = this.modelFor('authenticated.combined-course');

    const divisions = await this.currentUser.loadDivisions();

    const combinedCourseParticipations = await this.store
      .query('combined-course-participation', {
        combinedCourseId: combinedCourse.id,
        page: {
          number: params.pageNumber,
          size: params.pageSize,
        },
        filters: {
          fullName: params.fullName,
          statuses: params.statuses,
          divisions: params.divisions,
          groups: params.groups,
        },
      })
      .catch(() => {
        this.router.replaceWith('not-found');
      });

    return { combinedCourse, combinedCourseParticipations, divisions };
  }
}
