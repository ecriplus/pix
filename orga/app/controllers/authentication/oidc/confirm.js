import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { SessionStorageEntry } from 'pix-orga/utils/session-storage-entry';

const oidcAssociationConfirmationStorage = new SessionStorageEntry('oidcAssociationConfirmation');

export default class ConfirmController extends Controller {
  @service session;
  @service oidcIdentityProviders;
  @service joinInvitation;

  get identityProviderName() {
    const { identity_provider_slug } = this.model;
    return this.oidcIdentityProviders.findBySlug(identity_provider_slug)?.organizationName;
  }

  get oidcAuthenticationMethodNames() {
    const authenticationMethods = oidcAssociationConfirmationStorage.get()?.authenticationMethods;
    return this.oidcIdentityProviders.getIdentityProviderNamesByAuthenticationMethods(authenticationMethods);
  }

  get email() {
    return oidcAssociationConfirmationStorage.get()?.email;
  }

  get fullNameFromPix() {
    return oidcAssociationConfirmationStorage.get()?.fullNameFromPix;
  }

  get fullNameFromExternalIdentityProvider() {
    return oidcAssociationConfirmationStorage.get()?.fullNameFromExternalIdentityProvider;
  }

  get authenticationKey() {
    return oidcAssociationConfirmationStorage.get()?.authenticationKey;
  }

  @action
  async joinAndLinkAccount() {
    const { identity_provider_slug } = this.model;

    await this.session.authenticate('authenticator:oidc', {
      authenticationKey: this.authenticationKey,
      identityProviderSlug: identity_provider_slug,
      hostSlug: 'user/reconcile',
    });
  }
}
