import Route from '@ember/routing/route';
import { service } from '@ember/service';

import { SessionStorageEntry } from '../../../utils/session-storage-entry';

const oidcAssociationConfirmationStorage = new SessionStorageEntry('oidcAssociationConfirmation');

export default class ConfirmRoute extends Route {
  @service intl;
  @service oidcIdentityProviders;
  @service router;
  @service session;

  model(params) {
    const identityProviderSlug = params.identity_provider_slug;

    const identityProviderOrganizationName =
      this.oidcIdentityProviders.findBySlug(identityProviderSlug).organizationName;

    const storedInformations = oidcAssociationConfirmationStorage.get();
    return {
      identityProviderOrganizationName,
      authenticationMethods: storedInformations.authenticationMethods,
      fullNameFromPix: storedInformations.fullNameFromPix,
      fullNameFromExternalIdentityProvider: storedInformations.fullNameFromExternalIdentityProvider,
      email: storedInformations.email,
    };
  }
}
