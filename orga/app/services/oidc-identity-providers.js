import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class OidcIdentityProviders extends Service {
  @service store;

  @tracked isOidcProviderAuthenticationInProgress = false;

  async load() {
    await this.store.findAll('oidc-identity-provider');
  }

  get list() {
    return this.store.peekAll('oidc-identity-provider');
  }

  get hasIdentityProviders() {
    return this.list?.length > 0;
  }

  findBySlug(providerSlug) {
    if (!this.hasIdentityProviders) return;
    return this.list.find((oidcProvider) => oidcProvider.slug === providerSlug);
  }

  getIdentityProviderNamesByAuthenticationMethods(methods) {
    const identityProviderCodes = methods.map(({ identityProvider }) => identityProvider);
    return this.list
      .filter((provider) => identityProviderCodes.includes(provider.code))
      .map((provider) => provider.organizationName);
  }
}
