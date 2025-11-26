import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OldModuleIndexRoute extends Route {
  @service router;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  redirect(model) {
    this.router.replaceWith('module.details', model);
  }
}
