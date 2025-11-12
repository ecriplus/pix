import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CombinedCourseParticipationDetailsRoute extends Route {
  @service store;
  @service currentUser;
  @service router;

  beforeModel() {
    if (!this.currentUser.canAccessCampaignsPage) {
      return this.router.replaceWith('authenticated.index');
    }
  }

  async model(params) {
    const combinedCourse = this.modelFor('authenticated.combined-course');
    const combinedCourseParticipation = await this.store
      .queryRecord('combined-course-participation-detail', {
        combinedCourseId: combinedCourse.id,
        participationId: params.participation_id,
      })
      .catch((error) => {
        console.error(error);
        this.router.replaceWith('not-found');
      });
    return { combinedCourse, combinedCourseParticipation };
  }
}
