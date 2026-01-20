import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { SessionStorageEntry } from 'pix-orga/utils/session-storage-entry';

const oidcUserAuthenticationStorage = new SessionStorageEntry('oidcUserAuthentication');

export default class OidcSignupController extends Controller {
  @service session;
  @service oidcIdentityProviders;
  @service joinInvitation;

  get currentInvitation() {
    return this.joinInvitation.invitation;
  }

  get identityProviderName() {
    const { identity_provider_slug } = this.model;
    return this.oidcIdentityProviders.findBySlug(identity_provider_slug)?.organizationName;
  }

  get userClaims() {
    return oidcUserAuthenticationStorage.get()?.userClaims;
  }

  @action
  async joinAndSignup() {
    const { identity_provider_slug } = this.model;
    const { authenticationKey } = oidcUserAuthenticationStorage.get() || {};
    await this.session.authenticate('authenticator:oidc', {
      authenticationKey,
      identityProviderSlug: identity_provider_slug,
      hostSlug: 'users',
    });
  }
}
