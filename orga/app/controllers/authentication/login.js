import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class LoginController extends Controller {
  @service currentDomain;
  @service session;

  @action
  async authenticate(login, password) {
    await this.session.authenticate('authenticator:oauth2', login, password);
  }
}
