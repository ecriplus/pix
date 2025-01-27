import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import isEmailValid from '../../utils/email-validator';

export default class InviteForm extends Component {
  @service intl;
  @tracked modalOpen = false;
  @tracked emailError = null;

  @action
  openModal() {
    const emailInput = this.args?.email?.trim();
    if (!emailInput) {
      this.emailError = this.intl.t('pages.team-new.errors.mandatory-email-field');
      return;
    }
    const emails = emailInput.split(',').map((email) => email.trim());
    const areEmailsValid = emails.every((email) => isEmailValid(email));

    if (!areEmailsValid) {
      this.emailError = this.intl.t('pages.team-new.errors.invalid-input');
      return;
    }
    this.emailError = null;
    this.modalOpen = true;
  }

  @action
  closeModal() {
    this.modalOpen = false;
  }
}
