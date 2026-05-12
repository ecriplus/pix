import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CombinedCoursesRoute extends Route {
  @service featureToggles;
  @service router;

  beforeModel() {
    if (!this.featureToggles.featureToggles?.areCombinedCoursesEnabled) {
      this.router.transitionTo('combined-courses.disabled-feature-error');
    }
  }
}
