import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class CombinedCoursePresentationRoute extends Route {
  @service router;

  async beforeModel(transition) {
    const { code } = this.paramsFor('combined-courses');

    if (!transition.from || transition.from.name !== 'campaigns.assessment.results') {
      return this.router.replaceWith('combined-courses', code);
    }
  }

  model() {
    const { code } = this.paramsFor('combined-courses');

    return code;
  }
}
