import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class NotFoundRoute extends Route {
  @service router;

  buildRouteInfoMetadata() {
    return { blockPageview: true };
  }

  afterModel(model, transition) {
    transition.abort();
    this.router.transitionTo('authenticated');
  }
}
