import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ScoMediacentreController extends Controller {
  @service session;
  @service currentUser;
  @service accessStorage;
  @service router;

  @action
  async createAndReconcile(externalUser) {
    const response = await externalUser.save();

    this.session.revokeGarExternalUserToken();

    await this.session.authenticate('authenticator:oauth2', { token: response.accessToken });
    await this.currentUser.load();

    this.accessStorage.setAssociationDone(this.model.organizationToJoin.id);
  }

  @action
  async goToConnectionPage() {
    this.session.set('skipRedirectAfterSessionInvalidation', true);
    await this.session.invalidate();
    this.accessStorage.setHasUserSeenJoinPage(this.model.organizationToJoin.id);
    this.router.replaceWith('organizations.access', this.model.verifiedCode.id);
  }
}
