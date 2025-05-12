import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;

  buildRouteInfoMetadata() {
    return { blockPageview: true };
  }

  redirect() {
    this.router.replaceWith('authenticated.user-tutorials.recommended');
  }
}
