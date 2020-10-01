import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LoginOrRegisterToAccessRoute extends Controller {

  @service currentUser;
  @service session;
  @service store;

  @tracked displayRegisterForm = true;

  queryParams = ['displayRegisterForm'];

  @action
  toggleFormsVisibility() {
    this.displayRegisterForm = !this.displayRegisterForm;
  }

  @action
  async addGarAuthenticationMethodToUser(externalUserToken, expectedUserId) {

    await this.currentUser.load();
    await this.currentUser.user.save({
      adapterOptions: {
        authenticationMethodsSaml: true,
        externalUserToken,
        expectedUserId,
      },
    });

    await this._clearExternalUserContext();

    await this._reconcileUser();

    this.transitionToRoute('campaigns.start-or-resume', this.model.code, {
      queryParams: { associationDone: true, participantExternalId: this.participantExternalId },
    });
  }
  _reconcileUser() {
    return this.store.createRecord(
      'schooling-registration-user-association',
      { userId: this.currentUser.user.id, campaignCode: this.model.code })
      .save(
        { adapterOptions: { tryReconciliation: true } });
  }

  _clearExternalUserContext() {
    this.session.set('data.externalUser', null);
    this.session.set('data.expectedUserId', null);
  }

}
