import PixPagination from '@1024pix/pix-ui/components/pix-pagination';
import { fn, get } from '@ember/helper';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { eq, not } from 'ember-truth-helpers';

import ImportInformationBanner from '../import-information-banner';
import InElement from '../in-element';
import SelectableList from '../selectable-list';
import DeletionModal from '../ui/deletion-modal';
import EmptyState from '../ui/empty-state';
import ActionBar from './action-bar';
import EditStudentNumberModal from './modal/edit-student-number-modal';
import SupLearnerFilters from './sup-learner-filters';
import TableHeaders from './table-headers';
import TableRow from './table-row';

export default class ListItems extends Component {
  @service currentUser;
  @tracked selectedStudent = null;
  @tracked showDeletionModal = false;
  @tracked isShowingEditStudentNumberModal = false;
  @tracked isLoadingGroups;

  constructor() {
    super(...arguments);

    this.isLoadingGroups = true;
    this.currentUser.organization.groups.then((groups) => {
      this.isLoadingGroups = false;
      this.groups = groups.map(({ name }) => {
        return {
          label: name,
          value: name,
        };
      });
    });
  }

  get showCheckbox() {
    return this.currentUser.isAdminInOrganization;
  }

  get headerId() {
    return guidFor(this) + 'header';
  }

  get actionBarId() {
    return guidFor(this) + 'actionBar';
  }

  get paginationId() {
    return guidFor(this) + 'pagination';
  }

  get filtersId() {
    return guidFor(this) + 'filters';
  }

  get hasStudents() {
    return Boolean(this.args.students.length);
  }

  @action
  openDeletionModal() {
    this.showDeletionModal = true;
  }

  @action
  closeDeletionModal() {
    this.showDeletionModal = false;
  }

  @action
  async deleteStudents(selectedStudents, resetStudents) {
    await this.args.deleteStudents(selectedStudents);
    this.closeDeletionModal();
    resetStudents();
  }

  @action
  async onSaveStudentNumber(newStudentNumber) {
    await this.selectedStudent.save({
      adapterOptions: {
        updateStudentNumber: true,
        organizationId: this.currentUser.organization.id,
        studentNumber: newStudentNumber,
      },
    });
    this.selectedStudent.studentNumber = newStudentNumber;
  }

  @action
  openEditStudentNumberModal(student, event) {
    event.stopPropagation();
    this.selectedStudent = student;
    this.isShowingEditStudentNumberModal = true;
  }

  @action
  closeEditStudentNumberModal() {
    this.selectedStudent = null;
    this.isShowingEditStudentNumberModal = false;
  }

  @action
  async addResetOnFunction(wrappedFunction, resetParticipants, ...args) {
    await wrappedFunction(...args);
    resetParticipants();
  }

  @action
  addStopPropagationOnFunction(toggleParticipant, event) {
    event.stopPropagation();
    toggleParticipant();
  }
  <template>
    <ImportInformationBanner @importDetail={{@importDetail}} />

    <div id={{this.filtersId}} />

    <div class="panel">
      <table class="table content-text content-text--small">
        <caption class="screen-reader-only">{{t "pages.sup-organization-participants.table.description"}}</caption>
        <thead id={{this.headerId}} />
        <tbody>
          <SelectableList @items={{@students}}>
            <:manager as |allSelected someSelected toggleAll selectedStudents reset|>
              <InElement @destinationId={{this.headerId}}>
                <TableHeaders
                  @allSelected={{allSelected}}
                  @someSelected={{someSelected}}
                  @showCheckbox={{this.showCheckbox}}
                  @lastnameSort={{@lastnameSort}}
                  @hasStudents={{this.hasStudents}}
                  @participationCountOrder={{@participationCountOrder}}
                  @onToggleAll={{toggleAll}}
                  @sortByLastname={{fn this.addResetOnFunction @sortByLastname reset}}
                  @sortByParticipationCount={{fn this.addResetOnFunction @sortByParticipationCount reset}}
                  @hasComputeOrganizationLearnerCertificabilityEnabled={{@hasComputeOrganizationLearnerCertificabilityEnabled}}
                />
              </InElement>
              {{#if someSelected}}
                <InElement @destinationId={{this.actionBarId}}>
                  <ActionBar @count={{selectedStudents.length}} @openDeletionModal={{this.openDeletionModal}} />
                  <DeletionModal
                    @title={{t
                      "pages.sup-organization-participants.deletion-modal.title"
                      count=selectedStudents.length
                      firstname=(get selectedStudents "0.firstName")
                      lastname=(get selectedStudents "0.lastName")
                      htmlSafe=true
                    }}
                    @showModal={{this.showDeletionModal}}
                    @count={{selectedStudents.length}}
                    @onTriggerAction={{fn this.deleteStudents selectedStudents reset}}
                    @onCloseModal={{this.closeDeletionModal}}
                  >
                    <:content>
                      <p>{{t
                          "pages.sup-organization-participants.deletion-modal.content.header"
                          count=selectedStudents.length
                        }}</p>
                      <p>{{t
                          "pages.sup-organization-participants.deletion-modal.content.main-participation-prevent"
                          count=selectedStudents.length
                        }}</p>
                      <p>{{t
                          "pages.sup-organization-participants.deletion-modal.content.main-campaign-prevent"
                          count=selectedStudents.length
                        }}</p>
                      <p>{{t
                          "pages.sup-organization-participants.deletion-modal.content.main-participation-access"
                          count=selectedStudents.length
                        }}</p>
                      <p>{{t
                          "pages.sup-organization-participants.deletion-modal.content.main-new-campaign-access"
                          count=selectedStudents.length
                        }}</p>
                      <p><strong>{{t
                            "pages.sup-organization-participants.deletion-modal.content.footer"
                            count=selectedStudents.length
                          }}</strong></p>
                    </:content>
                  </DeletionModal>
                </InElement>
              {{/if}}
              <InElement @destinationId={{this.paginationId}} @waitForElement={{true}}>
                <PixPagination @pagination={{@students.meta}} @onChange={{reset}} @locale={{this.intl.primaryLocale}} />
              </InElement>
              <InElement @destinationId={{this.filtersId}}>
                <SupLearnerFilters
                  @studentsCount={{@students.meta.rowCount}}
                  @onFilter={{fn this.addResetOnFunction @onFilter reset}}
                  @searchFilter={{@searchFilter}}
                  @studentNumberFilter={{@studentNumberFilter}}
                  @certificabilityFilter={{@certificabilityFilter}}
                  @groupsFilter={{@groupsFilter}}
                  @onResetFilter={{fn this.addResetOnFunction @onResetFilter reset}}
                  @groupsOptions={{this.groups}}
                  @isLoadingGroups={{this.isLoadingGroups}}
                />
              </InElement>
            </:manager>
            <:item as |student toggleStudent isStudentSelected|>
              <TableRow
                @showCheckbox={{this.showCheckbox}}
                @student={{student}}
                @isStudentSelected={{isStudentSelected}}
                @onClickLearner={{fn @onClickLearner student.id}}
                @openEditStudentNumberModal={{this.openEditStudentNumberModal}}
                @isAdminInOrganization={{this.currentUser.isAdminInOrganization}}
                @onToggleStudent={{fn this.addStopPropagationOnFunction toggleStudent}}
                @hideCertifiableDate={{@hasComputeOrganizationLearnerCertificabilityEnabled}}
              />
            </:item>
          </SelectableList>
        </tbody>
      </table>

      {{#if (eq @students.meta.participantCount 0)}}
        <EmptyState
          @infoText={{t "pages.sup-organization-participants.empty-state.no-participants"}}
          @actionText={{t "pages.sup-organization-participants.empty-state.no-participants-action"}}
        />
      {{else if (not @students)}}
        <div class="table__empty content-text">
          {{t "pages.sup-organization-participants.table.empty"}}
        </div>
      {{/if}}
    </div>

    <EditStudentNumberModal
      @student={{this.selectedStudent}}
      @display={{this.isShowingEditStudentNumberModal}}
      @onClose={{this.closeEditStudentNumberModal}}
      @onSubmit={{this.onSaveStudentNumber}}
    />

    <div id={{this.actionBarId}} />
    <div id={{this.paginationId}} />
  </template>
}
