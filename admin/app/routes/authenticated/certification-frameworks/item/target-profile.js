import Route from '@ember/routing/route';

export default class TargetProfileRoute extends Route {
  model() {
    return this.modelFor('authenticated.certification-frameworks.item');
  }
}
