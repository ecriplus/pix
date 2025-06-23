import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import JoinScoInformationModal from 'mon-pix/components/routes/organizations/join-sco-information-modal';
import ScoForm from 'mon-pix/components/routes/organizations/sco-form';

export default class AssociateScoStudentForm extends Component {
  <template>
    <ScoForm
      @organizationName={{@organizationName}}
      @areNamesDisabled={{false}}
      @onSubmit={{this.submit}}
      @errorMessage={{this.errorMessage}}
    />

    {{#if this.displayInformationModal}}
      <JoinScoInformationModal
        @goToConnectionPage={{@goToConnectionPage}}
        @reconciliationError={{this.reconciliationError}}
        @reconciliationWarning={{this.reconciliationWarning}}
        @closeModal={{this.closeModal}}
        @associate={{this.associate}}
      />
    {{/if}}
  </template>
  @service session;
  @service currentUser;
  @service store;
  @service intl;

  @tracked errorMessage;

  @tracked displayInformationModal = false;
  @tracked reconciliationError = null;
  @tracked reconciliationWarning = null;

  @tracked attributes = null;

  @action
  closeModal() {
    this.displayInformationModal = false;
  }

  @action
  async submit(attributes) {
    this.errorMessage = null;
    this.displayInformationModal = false;
    this.reconciliationError = null;
    this.reconciliationWarning = null;
    this.attributes = attributes;

    const scoOrganizationLearnerRecord = this._createScoOrganizationLearnerRecord();
    try {
      await this.args.onSubmit(scoOrganizationLearnerRecord, { withReconciliation: false });
      scoOrganizationLearnerRecord.unloadRecord();
      this._displayWarningMessage();
    } catch (errorResponse) {
      scoOrganizationLearnerRecord.unloadRecord();
      this._setErrorMessageForAttemptNextAction(errorResponse);
    }
  }

  @action
  async associate(event) {
    event.preventDefault();
    this.errorMessage = null;

    const reconciliationRecord = this._createScoOrganizationLearnerRecord();
    try {
      await this.args.onSubmit(reconciliationRecord, { withReconciliation: true });
      this.closeModal();
    } catch (errorResponse) {
      reconciliationRecord.unloadRecord();
      this._setErrorMessageForAttemptNextAction(errorResponse);
    }
  }

  _createScoOrganizationLearnerRecord() {
    const { firstName, lastName, birthdate } = this.attributes;
    return this.store.createRecord('sco-organization-learner', {
      id: this.args.organizationId + '_' + lastName,
      firstName,
      lastName,
      birthdate,
      organizationId: this.args.organizationId,
    });
  }

  _setErrorMessageForAttemptNextAction(errorResponse) {
    if (!errorResponse.errors) throw errorResponse;
    errorResponse.errors.forEach((error) => {
      if (error.status === '409') {
        if ('USER_ALREADY_RECONCILED_IN_THIS_ORGANIZATION' === error.code) {
          this.errorMessage = this.intl.t('api-error-messages.join-error.r70');
        } else {
          this.reconciliationError = error;
          this.displayInformationModal = true;
          this.session.userIdForLearnerAssociation = error.meta.userId;
        }
      } else if (error.status === '422' && error.code === 'ACCOUNT_SEEMS_TO_BELONGS_TO_ANOTHER_USER') {
        this.reconciliationError = error;
        this.displayInformationModal = true;
      } else if (error.status === '404') {
        this.errorMessage = this.intl.t('pages.join.sco.error-not-found', { htmlSafe: true });
      } else if (error.status === '400') {
        this.errorMessage = this.intl.t('pages.join.sco.invalid-reconciliation-error', { htmlSafe: true });
      } else {
        this.errorMessage = error.detail;
      }
    });
  }

  _displayWarningMessage() {
    const { firstName, lastName } = this.attributes;
    const user = this.currentUser.user;
    const connectionMethod = user.email ? user.email : user.username;
    this.reconciliationWarning = {
      connectionMethod,
      firstName,
      lastName,
    };
    this.displayInformationModal = true;
  }
}
