import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CombinedCourseRoute extends Route {
  @service store;
  @service currentUser;
  @service router;

  beforeModel() {
    if (!this.currentUser.canAccessCampaignsPage) {
      return this.router.replaceWith('authenticated.index');
    }
  }

  model(params) {
    return this.store
      .findRecord('combined-course', params.combined_course_id)

      .catch((error) => {
        console.error(error);
        this.router.replaceWith('not-found');
      });
  }
}
