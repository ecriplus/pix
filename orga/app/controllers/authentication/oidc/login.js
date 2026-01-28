import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import ENV from 'pix-orga/config/environment';
import { SessionStorageEntry } from 'pix-orga/utils/session-storage-entry';

const oidcUserAuthenticationStorage = new SessionStorageEntry('oidcUserAuthentication');
const oidcAssociationConfirmationStorage = new SessionStorageEntry('oidcAssociationConfirmation');

export default class OidcLoginController extends Controller {
  @service oidcIdentityProviders;
  @service router;
  @service joinInvitation;

  get currentInvitation() {
    return this.joinInvitation.invitation;
  }

  get authenticationKey() {
    return oidcUserAuthenticationStorage.get()?.authenticationKey;
  }

  @action
  async redirectToAssociationConfirmation(email, password) {
    const identityProviderSlug = this.model.identity_provider_slug;
    const identityProvider = this.oidcIdentityProviders.findBySlug(identityProviderSlug);

    const response = await fetch(`${ENV.APP.API_HOST}/api/oidc/user/check-reconciliation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          attributes: {
            email,
            password,
            'authentication-key': this.authenticationKey,
            'identity-provider': identityProvider.code,
          },
        },
      }),
    });

    if (response.status != 200) throw response;
    const responseJson = await response.json();

    const attributes = responseJson.data.attributes;
    const oidcAssociationConfirmationData = {
      email,
      authenticationKey: this.authenticationKey,
      fullNameFromPix: attributes['full-name-from-pix'],
      fullNameFromExternalIdentityProvider: attributes['full-name-from-external-identity-provider'],
      authenticationMethods: attributes['authentication-methods'],
    };

    oidcAssociationConfirmationStorage.set(oidcAssociationConfirmationData);

    this.router.transitionTo('authentication.oidc.confirm', this.model.identity_provider_slug);
  }

  @action
  goToOidcProviderLoginPage() {
    this.oidcIdentityProviders.isOidcProviderAuthenticationInProgress = true;
  }

  @action
  goBack() {
    oidcUserAuthenticationStorage.remove();
    return this.router.transitionTo('authentication.login');
  }
}
