import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CreateAssessmentRoute extends Route {
  @service store;
  @service router;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  model(params) {
    return this.store.findRecord('course', params.course_id);
  }

  async redirect(course) {
    const assessment = await this.store.createRecord('assessment', { course, type: 'DEMO' }).save();
    this.router.replaceWith('assessments.resume', assessment.id);
  }
}
