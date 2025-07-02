import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CombinedCourseRoute extends Route {
  @service session;
  @service store;
  @service router;

  async beforeModel(transition) {
    const { code } = transition.to.params;
    this.code = code;
    this.transition = transition;
    const verifiedCode = await this.store.findRecord('verified-code', this.code);
    if (verifiedCode.type === 'campaign') {
      throw new Error();
    }

    this.session.requireAuthenticationAndApprovedTermsOfService(this.transition, () => {
      this.session.setCode(code);
      this.router.transitionTo('organizations.access', this.code);
    });
  }
}
