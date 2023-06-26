import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ActionsOnUsersRoleInOrganization extends Component {
  @service notifications;
  @service currentUser;

  @tracked showModal = false;
  @tracked organizationToDetach;

  get isSuperAdminOrMetier() {
    return this.currentUser.adminMember.isSuperAdmin || this.currentUser.adminMember.isMetier;
  }

  @action
  openModal(organization) {
    this.showModal = true;
    this.organizationToDetach = organization;
  }

  @action
  closeModal() {
    this.showModal = false;
    this.organizationToDetach = null;
  }

  @action
  async detachOrganizations(organizationId) {
    await this.args.detachOrganizations(organizationId);
    this.closeModal();
  }
}