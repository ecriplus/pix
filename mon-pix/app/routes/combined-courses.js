import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CombinedCourseRoute extends Route {
  @service session;
  @service store;
  @service router;
  @service accessStorage;

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
      this.router.transitionTo('organizations.access', code);
    });
  }

  async model(params) {
    const code = params.code;
    await this.store.adapterFor('combined-course').reassessStatus(code);
    return this.store.queryRecord('combined-course', { filter: { code } });
  }

  afterModel(combinedCourse) {
    this.accessStorage.clear(combinedCourse.organizationId);
  }
}
