import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class LoginSessionInvigilatorController extends Controller {
  @service store;
  @service router;
  @service currentUser;

  get currentUserEmail() {
    return this.currentUser.certificationPointOfContact.email;
  }

  @action
  async authenticateInvigilator({ sessionId, invigilatorPassword }) {
    const invigilatorAuthentication = this.store.createRecord('invigilator-authentication', {
      id: sessionId,
      sessionId,
      invigilatorPassword,
    });
    try {
      await invigilatorAuthentication.save();
    } finally {
      invigilatorAuthentication.unloadRecord();
    }
    return this.router.transitionTo('session-supervising', sessionId);
  }
}
