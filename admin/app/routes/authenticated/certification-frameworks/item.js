import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ItemRoute extends Route {
  @service store;
  @service router;

  beforeModel() {
    return this.store.findAll('complementary-certification');
  }

  model(params) {
    this.certificationFrameworkKey = params.certification_framework_key;
    const complementaryCertifications = this.store.peekAll('complementary-certification');
    const currentComplementaryCertification = complementaryCertifications.find(
      (cc) => cc.key === params.certification_framework_key,
    );
    return {
      frameworkKey: this.certificationFrameworkKey,
      currentComplementaryCertification,
    };
  }

  redirect(model, transition) {
    if (transition.to.name === 'authenticated.certification-frameworks.item.index') {
      if (this.certificationFrameworkKey !== 'CLEA') {
        this.router.transitionTo('authenticated.certification-frameworks.item.framework');
      } else {
        this.router.transitionTo('authenticated.certification-frameworks.item.target-profile');
      }
    }
  }
}
