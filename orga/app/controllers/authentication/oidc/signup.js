import Controller from '@ember/controller';
import { SessionStorageEntry } from 'pix-orga/utils/session-storage-entry';

const invitationStorage = new SessionStorageEntry('joinInvitationData');
const oidcUserAuthenticationStorage = new SessionStorageEntry('oidcUserAuthentication');

export default class OidcSignupController extends Controller {
  get currentInvitation() {
    return invitationStorage.get();
  }

  get userClaims() {
    return oidcUserAuthenticationStorage.get()?.userClaims;
  }

  get authenticationKey() {
    return oidcUserAuthenticationStorage.get()?.authenticationKey;
  }

  get invitationId() {
    return invitationStorage.get()?.invitationId;
  }

  get invitationCode() {
    return invitationStorage.get()?.code;
  }
}
