import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CampaignCombinedCoursesRoute extends Route {
  @service store;
  @service currentUser;
  @service router;

  async model() {
    return {
      combinedCourses: this.currentUser.combinedCourses || [],
    };
  }
}
