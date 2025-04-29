import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import EmailVerificationCode from 'mon-pix/components/user-account/email-verification-code';
import EmailWithValidationForm from 'mon-pix/components/user-account/email-with-validation-form';

export default class UpdateEmailWithValidation extends Component {
  <template>
    <div class="update-email-with-validation">
      {{#if this.showEmailForm}}
        <EmailWithValidationForm
          @disableEmailEditionMode={{@disableEmailEditionMode}}
          @showVerificationCode={{this.showVerificationCode}}
        />
      {{else}}
        <EmailVerificationCode
          @disableEmailEditionMode={{@disableEmailEditionMode}}
          @displayEmailUpdateMessage={{@displayEmailUpdateMessage}}
          @email={{this.newEmail}}
          @password={{this.password}}
        />
      {{/if}}
    </div>
  </template>
  @service store;

  @tracked newEmail = '';
  @tracked password = '';
  @tracked showEmailForm = true;

  @action
  showVerificationCode({ newEmail, password }) {
    this.newEmail = newEmail.trim();
    this.password = password;
    this.showEmailForm = false;
  }
}
