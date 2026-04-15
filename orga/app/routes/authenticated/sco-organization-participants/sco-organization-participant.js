import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ScoOrganizationParticipantRoute extends Route {
  @service store;
  @service router;
  @service currentUser;

  async model(params) {
    try {
      const organizationLearner = await this.store.findRecord('organization-learner', params.eleve_id);
      return { organizationLearner, organization: this.currentUser.organization };
    } catch {
      this.router.replaceWith('authenticated.sco-organization-participants');
    }
  }
}
