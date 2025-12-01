import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OldModulePassageRoute extends Route {
  @service router;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  redirect(model) {
    this.router.replaceWith('module.passage', model.shortId, model.slug);
  }
}
