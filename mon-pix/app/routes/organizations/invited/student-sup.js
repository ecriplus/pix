import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class StudentSupRoute extends Route {
  @service currentUser;
  @service accessStorage;
  @service store;
  @service session;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthenticationAndApprovedTermsOfService(transition);
  }

  model() {
    return this.modelFor('organizations');
  }

  async afterModel({ campaign, organizationToJoin }) {
    const organizationLearner = await this.store.queryRecord('organization-learner-identity', {
      userId: this.currentUser.user.id,
      organizationId: organizationToJoin.id,
    });

    if (organizationLearner) {
      this.accessStorage.setAssociationDone(organizationToJoin.id);
      this.router.replaceWith('campaigns.fill-in-participant-external-id', campaign.code);
    }
  }
}
