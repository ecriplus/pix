import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import sinon from 'sinon';

/**
 * Stubs the oidcIdentityProviders service.
 *
 * @param {Object} owner - The owner object.
 * @returns {Service} The stubbed oidcIdentityProviders service.
 */
export function stubOidcIdentityProvidersService(owner, { oidcIdentityProviders, featuredIdentityProviderCode } = {}) {
  class OidcProvidersServiceStub extends Service {
    @tracked isOidcProviderAuthenticationInProgress = false;

    constructor() {
      super();
      this.oidcIdentityProviders = oidcIdentityProviders || [];

      this.oidcIdentityProviders.forEach((oidcIdentityProvider) => {
        this[oidcIdentityProvider.id] = oidcIdentityProvider;
      });

      this.featuredIdentityProviderCode = featuredIdentityProviderCode;

      this.shouldDisplayAccountRecoveryBanner = sinon.stub();
    }

    load() {
      return Promise.resolve();
    }

    get list() {
      return this.oidcIdentityProviders;
    }

    get hasIdentityProviders() {
      return this.list.length > 0;
    }

    findBySlug(providerSlug) {
      return this.list.find((oidcProvider) => oidcProvider.slug === providerSlug);
    }
  }

  owner.unregister('service:oidcIdentityProviders');
  owner.register('service:oidcIdentityProviders', OidcProvidersServiceStub);
  return owner.lookup('service:oidcIdentityProviders');
}
