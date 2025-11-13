import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class OidcIdentityProviders extends Service {
  @service store;
  @service currentDomain;

  @tracked isOidcProviderAuthenticationInProgress = false;

  async load() {
    const oidcIdentityProviders = await this.store.findAll('oidc-identity-provider');
    oidcIdentityProviders.forEach((oidcIdentityProvider) => {
      this[oidcIdentityProvider.id] = oidcIdentityProvider;
    });
  }
}
