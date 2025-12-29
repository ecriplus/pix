import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class LoginController extends Controller {
  @service session;
  @service currentDomain;

  @action
  async authenticate(login, password) {
    await this.session.authenticate('authenticator:oauth2', login, password);
  }

  get displayRecoveryLink() {
    return this.currentDomain.isFranceDomain;
  }
}
