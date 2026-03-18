import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class GetRoute extends Route {
  @service store;
  @service router;

  /**
   * @param {Transition} transition
   */
  beforeModel(transition) {
    const certificateId = transition.to.params.id;
    const certificateSummaries = this.modelFor('authenticated.user-certifications');
    const certificateSummary = certificateSummaries.find(
      (certificateSummary) => certificateSummary.id === certificateId,
    );
    if (!certificateSummary || !certificateSummary.isValidated) {
      transition.abort();
      this.router.transitionTo('authenticated.user-certifications');
    }
  }

  model(params) {
    return this.store.findRecord('certification', params.id, { reload: true });
  }
}
