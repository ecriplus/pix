import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { CONNECTION_TYPES } from '../../helpers/connection-types';
import { guidFor } from '@ember/object/internals';

export default class ScoList extends Component {
  @service currentUser;
  @service intl;
  @service store;

  @tracked isLoadingDivisions;
  @tracked student = null;
  @tracked isShowingAuthenticationMethodModal = false;
  @tracked showResetPasswordModal = false;

  @tracked affectedStudents = [];

  constructor() {
    super(...arguments);

    this.isLoadingDivisions = true;
    this.currentUser.organization.divisions.then(() => {
      this.isLoadingDivisions = false;
    });
  }

  get divisions() {
    return this.currentUser.organization.divisions.map(({ name }) => ({
      label: name,
      value: name,
    }));
  }

  get connectionTypes() {
    return CONNECTION_TYPES;
  }

  get connectionTypesOptions() {
    return [
      { value: 'none', label: this.intl.t(CONNECTION_TYPES.none) },
      { value: 'email', label: this.intl.t(CONNECTION_TYPES.email) },
      { value: 'identifiant', label: this.intl.t(CONNECTION_TYPES.identifiant) },
      { value: 'mediacentre', label: this.intl.t(CONNECTION_TYPES.mediacentre) },
    ];
  }

  get showCheckbox() {
    return this.currentUser?.organization.type === 'SCO' && this.currentUser?.organization.isManagingStudents;
  }

  get headerId() {
    return guidFor(this) + 'mainCheckbox';
  }

  get actionBarId() {
    return guidFor(this) + 'actionBar';
  }

  get paginationControlId() {
    return guidFor(this) + 'paginationCOntrol';
  }

  get hasStudents() {
    return Boolean(this.args.students.length);
  }

  @action
  openAuthenticationMethodModal(student, event) {
    event.stopPropagation();
    this.student = student;
    this.isShowingAuthenticationMethodModal = true;
  }

  @action
  closeAuthenticationMethodModal() {
    this.isShowingAuthenticationMethodModal = false;
  }

  @action
  openResetPasswordModal(students, event) {
    event.stopPropagation();
    this.affectedStudents = students.filter((student) => student.authenticationMethods.includes('identifiant'));
    this.showResetPasswordModal = true;
  }

  @action
  closeResetPasswordModal() {
    this.showResetPasswordModal = false;
  }

  @action
  async resetPasswordForStudents(affectedStudents, resetSelectedStudents) {
    const affectedStudentsIds = affectedStudents.map((affectedStudents) => affectedStudents.id);
    try {
      await this.store
        .adapterFor('sco-organization-participant')
        .resetOrganizationLearnersPassword(this.currentUser.organization.id, affectedStudentsIds);
      this.closeResetPasswordModal();
      resetSelectedStudents();
    } catch (error) {
      console.log(error);
    }
  }

  @action
  addStopPropagationOnFunction(toggleStudent, event) {
    event.stopPropagation();
    toggleStudent();
  }
}
