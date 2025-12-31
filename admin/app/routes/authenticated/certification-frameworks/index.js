import Route from '@ember/routing/route';

export default class CertificationFrameworksIndexRoute extends Route {
  model() {
    return this.modelFor('authenticated.certification-frameworks');
  }
}
