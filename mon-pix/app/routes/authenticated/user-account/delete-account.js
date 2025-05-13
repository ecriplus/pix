import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DeleteAccountRoute extends Route {
  @service router;
  @service store;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  async model() {
    const user = this.modelFor('authenticated.user-account');
    return { user };
  }

  async redirect(model) {
    const accountInfo = await model.user.accountInfo;
    if (!accountInfo.canSelfDeleteAccount) {
      this.router.transitionTo('authenticated.user-account.personal-information');
    }
  }
}
