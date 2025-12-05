import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { SessionStorageEntry } from 'pix-orga/utils/session-storage-entry';

export default class OidcLoginController extends Controller {
  @service currentDomain;
  @service featureToggles;
  @service session;
  @service router;

  get currentInvitation() {
    const invitationStorage = new SessionStorageEntry('joinInvitationData');
    return invitationStorage.get();
  }

  @action
  async displayAssociationConfirmation() {
    this.router.transitionTo('authentication.oidc.confirm', this.model.identity_provider_slug);
  }

  @action
  goToOidcProviderLoginPage() {
    this.oidcIdentityProviders.isOidcProviderAuthenticationInProgress = true;
  }
}
