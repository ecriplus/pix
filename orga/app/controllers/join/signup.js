import Controller from '@ember/controller';

export default class SignupController extends Controller {
  queryParams = ['code', 'invitationId'];
  code = null;
  invitationId = null;

  get routeQueryParams() {
    return { code: this.code, invitationId: this.invitationId };
  }
}
