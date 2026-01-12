import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CombinedCourseBlueprintRoute extends Route {
  @service router;

  beforeModel() {
    this.router.replaceWith('authenticated.combined-course-blueprints.combined-course-blueprint.organizations');
  }
}
