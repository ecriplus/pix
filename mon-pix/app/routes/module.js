import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ModuleRoute extends Route {
  @service store;
  @service metrics;
  @service router;

  model(params) {
    const modules = this.store.peekAll('module');
    const currentModule = modules.find((module) => module.shortId === params.shortId);
    if (!currentModule) {
      return this.store.queryRecord('module', { shortId: params.shortId, encryptedRedirectionUrl: params.redirection });
    }
    return currentModule;
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
