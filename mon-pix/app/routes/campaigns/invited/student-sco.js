import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import SecuredRouteMixin from 'mon-pix/mixins/secured-route-mixin';
import get from 'lodash/get';

export default class StudentScoRoute extends Route.extend(SecuredRouteMixin) {
  @service currentUser;
  @service campaignStorage;
  @service store;
  @service router;

  model() {
    return this.modelFor('campaigns');
  }

  async afterModel(campaign) {
    let organizationLearner = await this.store.queryRecord('organization-learner-identity', {
      userId: this.currentUser.user.id,
      campaignCode: campaign.code,
    });

    if (!organizationLearner) {
      try {
        organizationLearner = await this.store
          .createRecord('schooling-registration-user-association', {
            userId: this.currentUser.user.id,
            campaignCode: campaign.code,
          })
          .save({ adapterOptions: { tryReconciliation: true } });
      } catch (error) {
        if (get(error, 'errors[0].status') !== '422') {
          throw error;
        }
      }
    }

    if (organizationLearner) {
      this.campaignStorage.set(campaign.code, 'associationDone', true);
      this.router.replaceWith('campaigns.invited.fill-in-participant-external-id', campaign.code);
    }
  }
}
