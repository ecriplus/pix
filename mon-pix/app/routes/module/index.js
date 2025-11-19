import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ModuleIndexRoute extends Route {
  @service('store') store;
  @service router;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  redirect() {
    this.router.replaceWith('module.details');
  }
}
