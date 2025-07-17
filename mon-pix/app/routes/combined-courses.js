import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CombinedCourseRoute extends Route {
  @service session;
  @service store;
  @service router;

  async beforeModel(transition) {
    const { code } = transition.to.params;
    if (!transition.from) {
      return this.router.replaceWith('organizations.access', code, { queryParams: { from: 'parcours' } });
    }

    const verifiedCode = await this.store.findRecord('verified-code', code);
    if (verifiedCode.type === 'campaign') {
      throw new Error();
    }

    this.session.requireAuthenticationAndApprovedTermsOfService(transition, () => {
      this.session.setCode(code);
      this.router.transitionTo('organizations.access', code);
    });
  }
}
