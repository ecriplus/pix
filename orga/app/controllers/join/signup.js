import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class SignupController extends Controller {
  @service session;
  @service joinInvitation;

  queryParams = ['code', 'invitationId'];
  code = null;
  invitationId = null;

  get routeQueryParams() {
    return { code: this.code, invitationId: this.invitationId };
  }

  @action
  async joinAndSignup(userRecord) {
    await userRecord.save();

    await this.joinInvitation.acceptInvitationByEmail(userRecord.email);

    await this.session.authenticate('authenticator:oauth2', userRecord.email, userRecord.password);
  }
}
