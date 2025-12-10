import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { SessionStorageEntry } from 'pix-orga/utils/session-storage-entry';

const oidcUserAuthenticationStorage = new SessionStorageEntry('oidcUserAuthentication');
const invitationStorage = new SessionStorageEntry('joinInvitationData');
const oidcAssociationConfirmationStorage = new SessionStorageEntry('oidcAssociationConfirmation');

export default class OidcLoginController extends Controller {
  @service store;
  @service oidcIdentityProviders;
  @service session;
  @service router;

  get currentInvitation() {
    return invitationStorage.get();
  }

  get authenticationKey() {
    return oidcUserAuthenticationStorage.get()?.authenticationKey;
  }

  @action
  async redirectToAssociationConfirmation(email, password) {
    const identityProviderSlug = this.model.identity_provider_slug;
    const identityProvider = this.oidcIdentityProviders.findBySlug(identityProviderSlug);

    const authenticationRequest = this.store.createRecord('user-oidc-authentication-request', {
      password,
      email,
      authenticationKey: this.authenticationKey,
      identityProvider: identityProvider.code,
    });

    const oidcAssociationConfirmationData = await authenticationRequest.login();
    oidcAssociationConfirmationStorage.set({ ...oidcAssociationConfirmationData, email });

    this.router.transitionTo('authentication.oidc.confirm', this.model.identity_provider_slug);
  }

  @action
  goToOidcProviderLoginPage() {
    this.oidcIdentityProviders.isOidcProviderAuthenticationInProgress = true;
  }
}
