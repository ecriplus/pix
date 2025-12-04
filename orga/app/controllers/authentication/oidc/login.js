import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { SessionStorageEntry } from 'pix-orga/utils/session-storage-entry';

export default class OidcLoginController extends Controller {
  @service currentDomain;
  @service featureToggles;
  @service session;

  get currentInvitation() {
    const invitationStorage = new SessionStorageEntry('joinInvitationData');
    return invitationStorage.get();
  }

  @action
  async reconcile() {
    this.isLoading = true;

    try {
      await this.session.authenticate('authenticator:oidc', {
        authenticationKey: this.args.authenticationKey,
        identityProviderSlug: this.args.identityProviderSlug,
        hostSlug: 'user/reconcile',
      });
    } catch (responseError) {
      this.reconcileErrorMessage = this.errorMessages.getAuthenticationErrorMessage(responseError);
    } finally {
      this.isLoading = false;
    }
  }
}
