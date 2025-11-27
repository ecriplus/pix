import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ModuleDetailsRoute extends Route {
  @service router;

  redirect(model) {
    this.router.replaceWith('module.details', model);
  }
}
