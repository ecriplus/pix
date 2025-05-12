import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ModuleIndexRoute extends Route {
  @service router;

  buildRouteInfoMetadata() {
    return { blockPageview: true };
  }

  redirect() {
    this.router.replaceWith('module.details');
  }
}
