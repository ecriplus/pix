import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AuthenticatedSessionsWithRequiredActionListController extends Controller {
  @service currentUser;

  @tracked assignedToSelfOnly = false;

  get sessionsList() {
    const sessions = this.model;
    if (this.assignedToSelfOnly) {
      return sessions.filter(
        (session) => session.assignedCertificationOfficerName === this.currentUser.adminMember.fullName,
      );
    }
    return sessions;
  }

  get hasSessionsToProcess() {
    return Boolean(this.model?.length);
  }

  @action toggleAssignedSessionsDisplay() {
    this.assignedToSelfOnly = !this.assignedToSelfOnly;
    this.sessionsList;
  }
}
