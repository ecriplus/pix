import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class JoinController extends Controller {
  @service store;
  @service session;
  @service joinInvitation;

  queryParams = ['code', 'invitationId'];
  code = null;
  invitationId = null;

  get routeQueryParams() {
    return { code: this.code, invitationId: this.invitationId };
  }

  @action
  async authenticate(email, password) {
    await this.session.authenticate('authenticator:oauth2', email, password);
  }
}
