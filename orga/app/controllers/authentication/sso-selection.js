import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class SsoSelectionController extends Controller {
  queryParams = ['code', 'invitationId', 'isForSignup'];
  code = null;
  invitationId = null;
  isForSignup = null;

  @service router;

  @action
  goBack() {
    if (this.isForInvitation && this.isForSignup) {
      const queryParams = { code: this.code, invitationId: this.invitationId };
      return this.router.transitionTo('join.signup', { queryParams });
    }
    if (this.isForInvitation) {
      const queryParams = { code: this.code, invitationId: this.invitationId };
      return this.router.transitionTo('join', { queryParams });
    }
    return this.router.transitionTo('authentication.login');
  }

  get isForInvitation() {
    return Boolean(this.code) && Boolean(this.invitationId);
  }
}
