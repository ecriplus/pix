import { action } from '@ember/object';
import Route from '@ember/routing/route';

export default class CertificationCoursesRoute extends Route {
  async model() {
    const user = this.modelFor('authenticated.users.get');
    await user.hasMany('certificationCourses').reload();
    const certificationCourses = await user.certificationCourses;
    return certificationCourses;
  }

  @action
  refreshModel() {
    this.refresh();
  }
}
