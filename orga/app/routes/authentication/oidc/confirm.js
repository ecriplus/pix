import Route from '@ember/routing/route';
import { service } from '@ember/service';

import { SessionStorageEntry } from '../../../utils/session-storage-entry';

const oidcAssociationConfirmationStorage = new SessionStorageEntry('oidcAssociationConfirmation');
const invitationStorage = new SessionStorageEntry('joinInvitationData');

export default class ConfirmRoute extends Route {
  @service oidcIdentityProviders;

  model(params) {
    const identityProviderSlug = params.identity_provider_slug;

    const identityProviderOrganizationName =
      this.oidcIdentityProviders.findBySlug(identityProviderSlug).organizationName;

    const storedInformations = oidcAssociationConfirmationStorage.get();

    const storedInvitation = invitationStorage.get() ?? {};
    const invitationId = storedInvitation.invitationId;
    const invitationCode = storedInvitation.code;

    return {
      identityProviderOrganizationName,
      identityProviderSlug,
      invitationId,
      invitationCode,
      authenticationKey: storedInformations.authenticationKey,
      authenticationMethods: storedInformations.authenticationMethods,
      fullNameFromPix: storedInformations.fullNameFromPix,
      fullNameFromExternalIdentityProvider: storedInformations.fullNameFromExternalIdentityProvider,
      email: storedInformations.email,
    };
  }
}
