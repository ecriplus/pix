import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AnonymousRoute extends Route {
  @service session;
  @service currentUser;
  @service store;

  beforeModel() {
    this.session.prohibitAuthentication('authenticated.user-dashboard');
  }

  async model() {
    return this.modelFor('organizations');
  }

  async afterModel({ verifiedCode }) {
    await this.session.authenticate('authenticator:anonymous', { campaignCode: verifiedCode.id });
    await this.currentUser.load();
  }
}
