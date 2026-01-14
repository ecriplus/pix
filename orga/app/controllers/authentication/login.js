import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class LoginController extends Controller {
  @service session;
  @service currentDomain;
  @service joinInvitation;
  @service authErrorMessages;

  @action
  async authenticate(login, password) {
    await this.session.authenticate('authenticator:oauth2', login, password);
  }

  get displayRecoveryLink() {
    return this.currentDomain.isFranceDomain;
  }

  get errorMessage() {
    if (this.error) {
      return this.authErrorMessages.getAuthenticationErrorMessage({ code: this.error });
    }
    if (this.joinInvitation.error) {
      return this.authErrorMessages.getAuthenticationErrorMessage({ code: this.joinInvitation.error });
    }
    return null;
  }
}
