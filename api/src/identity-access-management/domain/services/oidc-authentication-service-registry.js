import { InvalidIdentityProviderError } from '../../../shared/domain/errors.js';
import { cryptoService } from '../../../shared/domain/services/crypto-service.js';
import { PromiseUtils } from '../../../shared/infrastructure/utils/promise-utils.js';
import { oidcProviderRepository } from '../../infrastructure/repositories/oidc-provider-repository.js';
import { FwbOidcAuthenticationService } from './fwb-oidc-authentication-service.js';
import { OidcAuthenticationService } from './oidc-authentication-service.js';
import { PoleEmploiOidcAuthenticationService } from './pole-emploi-oidc-authentication-service.js';

export class OidcAuthenticationServiceRegistry {
  #allOidcProviderServices = null;
  #readyOidcProviderServicesByRequestedApplications = {};

  constructor(dependencies = {}) {
    this.oidcProviderRepository = dependencies.oidcProviderRepository;
  }

  async configureReadyOidcProviderServiceByCode(oidcProviderServiceCode) {
    const oidcProviderService = this.#allOidcProviderServices?.find(
      (oidcProviderService) => oidcProviderService.code === oidcProviderServiceCode,
    );

    if (!oidcProviderService) return;

    await oidcProviderService.initializeClientConfig();

    return true;
  }

  /**
   * @return {OidcAuthenticationService[]|null}
   */
  getAllOidcProviderServices() {
    return this.#allOidcProviderServices;
  }

  getReadyOidcProviderServicesByRequestedApplication(requestedApplication) {
    const groupByKey = generateGroupByKey(requestedApplication.applicationName, requestedApplication.applicationTld);
    return this.#readyOidcProviderServicesByRequestedApplications[groupByKey] || [];
  }

  getOidcProviderServiceByCode({ identityProviderCode, requestedApplication }) {
    const oidcProviderService = this.getReadyOidcProviderServicesByRequestedApplication(requestedApplication).find(
      (service) => identityProviderCode === service.code,
    );

    if (!oidcProviderService) {
      throw new InvalidIdentityProviderError(identityProviderCode);
    }

    return oidcProviderService;
  }

  async loadOidcProviderServices(oidcProviderServices) {
    if (this.#allOidcProviderServices) {
      return;
    }

    if (!oidcProviderServices) {
      const oidcProviders = await oidcProviderRepository.findAllOidcProviders();

      oidcProviderServices = await PromiseUtils.mapSeries(oidcProviders, async (oidcProvider) => {
        await oidcProvider.decryptClientSecret(cryptoService);
        switch (oidcProvider.identityProvider) {
          case 'FWB':
            return new FwbOidcAuthenticationService(oidcProvider);
          case 'POLE_EMPLOI':
            return new PoleEmploiOidcAuthenticationService(oidcProvider);
          default:
            return new OidcAuthenticationService(oidcProvider);
        }
      });
    }

    this.#allOidcProviderServices = oidcProviderServices;

    this.#readyOidcProviderServicesByRequestedApplications = Object.groupBy(
      this.#allOidcProviderServices.filter(
        (oidcProviderService) => oidcProviderService.isReady || oidcProviderService.isReadyForPixAdmin,
      ),
      (oidcProviderService) => generateGroupByKey(oidcProviderService.application, oidcProviderService.applicationTld),
    );

    return true;
  }

  testOnly_reset() {
    this.#allOidcProviderServices = null;
    this.#readyOidcProviderServicesByRequestedApplications = {};
  }
}

function generateGroupByKey(application, applicationTld) {
  return application + applicationTld;
}
