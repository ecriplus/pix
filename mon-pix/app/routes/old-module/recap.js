import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ModuleRecapRoute extends Route {
  @service store;
  @service router;

  model(transition) {
    const model = this.modelFor('old-module');

    if (!transition.from) {
      return this.router.replaceWith('module.details', model);
    }

    return model;
  }
}
