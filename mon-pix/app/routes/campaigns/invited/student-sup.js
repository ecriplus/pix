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
    return this.modelFor('campaigns');
  }

  async afterModel(campaign) {
    const organizationLearner = await this.store.queryRecord('organization-learner-identity', {
      userId: this.currentUser.user.id,
      campaignCode: campaign.code,
    });

    if (organizationLearner) {
      this.accessStorage.setAssociationDone(campaign.organizationId);
      this.router.replaceWith('campaigns.invited.fill-in-participant-external-id', campaign.code);
    }
  }
}
