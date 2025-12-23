import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ItemRoute extends Route {
  @service store;
  @service router;

  beforeModel() {
    return this.store.findAll('complementary-certification');
  }

  model(params) {
    return this.store.findRecord('complementary-certification', params.complementary_certification_id, {
      reload: true,
    });
  }

  redirect(model, transition) {
    if (transition.to.name === 'authenticated.complementary-certifications.item.index') {
      if (model.hasComplementaryReferential) {
        this.router.transitionTo('authenticated.complementary-certifications.item.framework');
      } else {
        this.router.transitionTo('authenticated.complementary-certifications.item.target-profile');
      }
    }
  }
}
