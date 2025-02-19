import PixPagination from '@1024pix/pix-ui/components/pix-pagination';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { eq, not } from 'ember-truth-helpers';
import ENV from 'pix-orga/config/environment';

import { CONNECTION_TYPES } from '../../helpers/connection-types';
import ImportInformationBanner from '../import-information-banner';
import InElement from '../in-element';
import SelectableList from '../selectable-list';
import EmptyState from '../ui/empty-state';
import GenerateUsernamePasswordModal from './generate-username-password-modal';
import ListActionBar from './list-action-bar';
import ManageAuthenticationMethodModal from './manage-authentication-method-modal';
import ResetPasswordModal from './reset-password-modal';
import ScoLearnerFilters from './sco-learner-filters';
import TableHeaders from './table-headers';
import TableRow from './table-row';

export default class ScoList extends Component {
  @service currentUser;
  @service notifications;
  @service intl;
  @service store;
  @service session;
  @service fileSaver;

  @tracked isLoadingDivisions;
  @tracked student = null;
  @tracked isShowingAuthenticationMethodModal = false;
  @tracked showResetPasswordModal = false;
  @tracked showGenerateUsernamePasswordModal = false;
  @tracked divisions;

  @tracked affectedStudents = [];

  constructor() {
    super(...arguments);

    this.isLoadingDivisions = true;
    this.currentUser.organization.divisions.then((divisions) => {
      this.isLoadingDivisions = false;
      this.divisions = divisions.map(({ name }) => ({
        label: name,
        value: name,
      }));
    });
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
      { value: 'without_mediacentre', label: this.intl.t(CONNECTION_TYPES.without_mediacentre) },
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

  get hasGarIdentityProvider() {
    return this.currentUser.organization.hasGarIdentityProvider;
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
  openGenerateUsernamePasswordModal(students, event) {
    event.stopPropagation();
    this.affectedStudents = students.filter((student) => student.isAssociated);
    this.showGenerateUsernamePasswordModal = true;
  }

  @action
  closeGenerateUsernamePasswordModal() {
    this.showGenerateUsernamePasswordModal = false;
  }

  @action
  async generateUsernamePasswordForStudents(affectedStudents, resetSelectedStudents) {
    const affectedStudentsIds = affectedStudents.map((affectedStudents) => affectedStudents.id);
    try {
      await this.store.adapterFor('sco-organization-participant').generateOrganizationLearnersUsernamePassword({
        fileSaver: this.fileSaver,
        organizationId: this.currentUser.organization.id,
        organizationLearnersIds: affectedStudentsIds,
        token: this.session?.data?.authenticated?.access_token,
      });
      this.closeResetPasswordModal();
      resetSelectedStudents();
      this.notifications.sendSuccess(
        this.intl.t('pages.sco-organization-participants.messages.password-reset-success'),
      );
      await this.args.refreshValues();
    } catch (fetchErrors) {
      const error = Array.isArray(fetchErrors) && fetchErrors.length > 0 && fetchErrors[0];
      let errorMessage;
      switch (error?.code) {
        case 'USER_DOES_NOT_BELONG_TO_ORGANIZATION':
          errorMessage = this.intl.t(
            'api-error-messages.student-password-reset.user-does-not-belong-to-organization-error',
          );
          break;
        case 'ORGANIZATION_LEARNER_DOES_NOT_BELONG_TO_ORGANIZATION':
          errorMessage = this.intl.t(
            'api-error-messages.student-password-reset.organization-learner-does-not-belong-to-organization-error',
          );
          break;
        case 'ORGANIZATION_LEARNER_WITHOUT_USERNAME':
          errorMessage = this.intl.t(
            'api-error-messages.student-password-reset.organization-learner-without-username-error',
          );
          break;
        default:
          errorMessage = this.intl.t(this._getI18nKeyByStatus(error.status));
      }
      this.notifications.sendError(errorMessage);
    }
  }

  _getI18nKeyByStatus(status) {
    switch (status) {
      case 400:
        return ENV.APP.API_ERROR_MESSAGES.BAD_REQUEST.I18N_KEY;
      case 401:
        return ENV.APP.API_ERROR_MESSAGES.LOGIN_UNAUTHORIZED.I18N_KEY;
      case 422:
        return ENV.APP.API_ERROR_MESSAGES.BAD_REQUEST.I18N_KEY;
      case 504:
        return ENV.APP.API_ERROR_MESSAGES.GATEWAY_TIMEOUT.I18N_KEY;
      default:
        return ENV.APP.API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR.I18N_KEY;
    }
  }

  @action
  addStopPropagationOnFunction(toggleStudent, event) {
    event.stopPropagation();
    toggleStudent();
  }

  <template>
    <ImportInformationBanner @importDetail={{@importDetail}} />

    <ScoLearnerFilters
      @studentsCount={{@students.meta.rowCount}}
      @onFilter={{@onFilter}}
      @searchFilter={{@searchFilter}}
      @certificabilityFilter={{@certificabilityFilter}}
      @connectionTypeFilter={{@connectionTypeFilter}}
      @divisionsFilter={{@divisionsFilter}}
      @onResetFilter={{@onResetFilter}}
      @divisionsOptions={{this.divisions}}
      @isLoadingDivisions={{this.isLoadingDivisions}}
      @connectionTypesOptions={{this.connectionTypesOptions}}
    />

    <div class="panel">
      <table class="table content-text content-text--small">
        <caption class="screen-reader-only">{{t "pages.sco-organization-participants.table.description"}}</caption>
        <thead id={{this.headerId}} />

        <tbody>
          <SelectableList @items={{@students}}>
            <:manager as |allSelected someSelected toggleAll selectedStudents reset|>
              <InElement @destinationId={{this.headerId}}>
                <TableHeaders
                  @showCheckbox={{this.showCheckbox}}
                  @lastnameSort={{@lastnameSort}}
                  @onSortByLastname={{@sortByLastname}}
                  @participationCountOrder={{@participationCountOrder}}
                  @onSortByParticipationCount={{@sortByParticipationCount}}
                  @divisionSort={{@divisionSort}}
                  @onSortByDivision={{@sortByDivision}}
                  @allSelected={{allSelected}}
                  @someSelected={{someSelected}}
                  @onToggleAll={{toggleAll}}
                  @hasStudents={{this.hasStudents}}
                  @hasComputeOrganizationLearnerCertificabilityEnabled={{@hasComputeOrganizationLearnerCertificabilityEnabled}}
                />
              </InElement>
              <InElement @destinationId={{this.paginationControlId}} @waitForElement={{true}}>
                <PixPagination @pagination={{@students.meta}} @onChange={{reset}} @locale={{this.intl.primaryLocale}} />
              </InElement>
              {{#if someSelected}}
                <InElement @destinationId={{this.actionBarId}}>
                  <ListActionBar
                    @count={{selectedStudents.length}}
                    @openGenerateUsernamePasswordModal={{fn this.openGenerateUsernamePasswordModal selectedStudents}}
                    @openResetPasswordModal={{fn this.openResetPasswordModal selectedStudents}}
                    @hasGarIdentityProvider={{this.hasGarIdentityProvider}}
                  />
                  <ResetPasswordModal
                    @showModal={{this.showResetPasswordModal}}
                    @totalSelectedStudents={{selectedStudents.length}}
                    @totalAffectedStudents={{this.affectedStudents.length}}
                    @onTriggerAction={{fn this.generateUsernamePasswordForStudents this.affectedStudents reset}}
                    @onCloseModal={{this.closeResetPasswordModal}}
                  />
                  <GenerateUsernamePasswordModal
                    @showModal={{this.showGenerateUsernamePasswordModal}}
                    @totalAffectedStudents={{this.affectedStudents.length}}
                    @onTriggerAction={{fn this.generateUsernamePasswordForStudents this.affectedStudents reset}}
                    @onCloseModal={{this.closeGenerateUsernamePasswordModal}}
                  />
                </InElement>
              {{/if}}
            </:manager>
            <:item as |student toggleStudent isStudentSelected index|>
              <TableRow
                @showCheckbox={{this.showCheckbox}}
                @index={{index}}
                @student={{student}}
                @isStudentSelected={{isStudentSelected}}
                @openAuthenticationMethodModal={{this.openAuthenticationMethodModal}}
                @onToggleStudent={{fn this.addStopPropagationOnFunction toggleStudent}}
                @onClickLearner={{fn @onClickLearner student.id}}
                @hideCertifiableDate={{@hasComputeOrganizationLearnerCertificabilityEnabled}}
              />
            </:item>
          </SelectableList>
        </tbody>
      </table>
      {{#if (eq @students.meta.participantCount 0)}}
        <EmptyState
          @infoText={{t "pages.sco-organization-participants.no-participants"}}
          @actionText={{t "pages.sco-organization-participants.no-participants-action"}}
        />
      {{else if (not @students)}}
        <div class="table__empty content-text">
          {{t "pages.sco-organization-participants.table.empty"}}
        </div>
      {{/if}}
    </div>
    <div id={{this.actionBarId}} />
    <div id={{this.paginationControlId}} />

    <ManageAuthenticationMethodModal
      @organizationId={{this.currentUser.organization.id}}
      @student={{this.student}}
      @display={{this.isShowingAuthenticationMethodModal}}
      @onClose={{this.closeAuthenticationMethodModal}}
    />
  </template>
}
