import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ExistingParticipation extends Route {
  @service store;
  @service currentUser;
  @service session;

  beforeModel(transition) {
    this.session.requireAuthenticationAndApprovedTermsOfService(transition);
  }

  async model() {
    const { code } = this.paramsFor('campaigns');
    const organizationToJoin = await this.store.queryRecord('organization-to-join', { code });

    return this.store.queryRecord('organization-learner-identity', {
      userId: this.currentUser.user.id,
      organizationId: organizationToJoin.id,
    });
  }
}
