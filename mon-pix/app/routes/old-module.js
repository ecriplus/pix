import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ModuleRoute extends Route {
  @service store;
  @service metrics;
  @service router;

  model(params) {
    return this.store.queryRecord('module', { slug: params.slug, encryptedRedirectionUrl: params.redirection });
  }

  activate() {
    this.metrics.context.code = this.paramsFor('module').slug;
    this.metrics.context.type = 'module';
  }

  deactivate() {
    delete this.metrics.context.code;
    delete this.metrics.context.type;
  }
}
