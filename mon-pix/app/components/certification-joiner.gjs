import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixLabel from '@1024pix/pix-ui/components/pix-label';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import t from 'ember-intl/helpers/t';
import _get from 'lodash/get';

function _pad(num, size) {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

function _isMatchingReconciledStudentNotFoundError(err) {
  return _get(err, 'errors[0].code') === 'MATCHING_RECONCILED_STUDENT_NOT_FOUND';
}

function _isWrongAccount(err) {
  return _get(err, 'errors[0].status') === '409' && _get(err, 'errors[0].code') === 'UNEXPECTED_USER_ACCOUNT';
}

function _isSessionNotAccessibleError(err) {
  return _get(err, 'errors[0].status') === '412';
}

function _isLanguageNotSupported(err) {
  return _get(err, 'errors[0].code') === 'LANGUAGE_NOT_SUPPORTED';
}

export default class CertificationJoiner extends Component {
  <template>
    {{! template-lint-disable require-input-label no-bare-strings }}
    <section class="certification-joiner">
      <h1 class="certification-joiner__title">{{t "pages.certification-joiner.first-title"}}</h1>
      <form autocomplete="off" {{on "submit" this.attemptNext}}>
        <p class="certification-joiner__mandatory">{{t "common.form.mandatory-all-fields"}}</p>

        <PixInput
          @id="certificationJoinerSessionId"
          @errorMessage={{this.sessionIdIsNotANumberMessage}}
          @validationStatus={{this.sessionIdStatus}}
          pattern={{this.SESSION_ID_VALIDATION_PATTERN}}
          title={{t "pages.certification-joiner.form.fields-validation.session-number-error"}}
          {{on "input" this.checkSessionIdIsValid}}
          {{on "change" this.setSessionId}}
          inputmode="decimal"
          required="true"
          @subLabel={{t "pages.certification-joiner.form.fields.session-number-information"}}
          placeholder={{t "pages.certification-joiner.form.placeholders.session-number"}}
        >
          <:label>{{t "pages.certification-joiner.form.fields.session-number"}}</:label>
        </PixInput>
        <PixInput
          @id="certificationJoinerFirstName"
          required="true"
          {{on "change" this.setFirstName}}
          placeholder={{t "pages.certification-joiner.form.placeholders.first-name"}}
        >
          <:label>{{t "pages.certification-joiner.form.fields.first-name"}}</:label>
        </PixInput>
        <PixInput
          @id="certificationJoinerLastName"
          required="true"
          {{on "change" this.setLastName}}
          placeholder={{t "pages.certification-joiner.form.placeholders.birth-name"}}
        >
          <:label>{{t "pages.certification-joiner.form.fields.birth-name"}}</:label>
        </PixInput>
        <div>
          <PixLabel class="certification-joiner__label" for="certificationJoinerDayOfBirth">{{t
              "pages.certification-joiner.form.fields.birth-date"
            }}</PixLabel>
          <div class="certification-joiner__birthdate" id="certificationJoinerBirthDate">
            <PixInput
              @id="certificationJoinerDayOfBirth"
              min="1"
              max="31"
              type="number"
              placeholder={{t "pages.certification-joiner.form.placeholders.birth-day"}}
              {{on "change" this.setDayOfBirth}}
              {{on "input" this.handleDayInputChange}}
              {{on "focus-in" this.handleInputFocus}}
              @screenReaderOnly="true"
              required="true"
            >
              <:label>{{t "pages.certification-joiner.form.fields.birth-day"}}</:label>
            </PixInput>
            <PixInput
              @id="certificationJoinerMonthOfBirth"
              min="1"
              max="12"
              type="number"
              placeholder={{t "pages.certification-joiner.form.placeholders.birth-month"}}
              {{on "change" this.setMonthOfBirth}}
              {{on "input" this.handleMonthInputChange}}
              {{on "focus-in" this.handleInputFocus}}
              @screenReaderOnly="true"
              required="true"
            >
              <:label>{{t "pages.certification-joiner.form.fields.birth-month"}}</:label>
            </PixInput>
            <PixInput
              @id="certificationJoinerYearOfBirth"
              min="1900"
              max="2100"
              type="number"
              placeholder={{t "pages.certification-joiner.form.placeholders.birth-year"}}
              {{on "change" this.setYearOfBirth}}
              {{on "focus-in" this.handleInputFocus}}
              @screenReaderOnly="true"
              required="true"
            >
              <:label>{{t "pages.certification-joiner.form.fields.birth-year"}}</:label>
            </PixInput>
          </div>
        </div>

        {{#if this.errorMessage}}
          <div class="certification-course-page__errors">
            <PixNotificationAlert @type="error">
              {{this.errorMessage}}
              {{#if this.errorDetailList}}
                <ul class="certification-course-page__errors__list">
                  {{#each this.errorDetailList as |errorDetailElement|}}
                    <li>{{errorDetailElement}}</li>
                  {{/each}}
                </ul>
              {{/if}}
              {{#if this.errorMessageLink}}
                <a rel="noopener noreferrer" target="_blank" href={{this.errorMessageLink.url}}>
                  {{this.errorMessageLink.label}}
                  <PixIcon @name="openNew" @title={{t "navigation.external-link-title"}} />
                </a>

              {{/if}}
            </PixNotificationAlert>
          </div>
        {{/if}}
        <PixButton @id="certificationJoinerSubmitButton" @type="submit">{{t
            "pages.certification-joiner.form.actions.submit"
          }}
        </PixButton>
      </form>
    </section>
  </template>
  @service store;
  @service intl;

  SESSION_ID_VALIDATION_PATTERN = '^[0-9]*$';
  V3_CERTIFICATION_SUPPORTED_LANGUAGES = ['en', 'fr'];

  @tracked errorMessage = null;
  @tracked errorDetailList = [];
  @tracked errorMessageLink = null;
  @tracked sessionIdIsNotANumberMessage = null;
  @tracked sessionIdStatus = 'default';
  @tracked validationClassName = '';
  @tracked sessionId = null;
  @tracked firstName = null;
  @tracked lastName = null;
  @tracked dayOfBirth = null;
  @tracked monthOfBirth = null;
  @tracked yearOfBirth = null;

  get birthdate() {
    const monthOfBirth = _pad(this.monthOfBirth, 2);
    const dayOfBirth = _pad(this.dayOfBirth, 2);
    return [this.yearOfBirth, monthOfBirth, dayOfBirth].join('-');
  }

  createCertificationCandidate() {
    const { firstName, lastName, birthdate, sessionId } = this;

    return this.store.createRecord('certification-candidate', {
      sessionId,
      birthdate,
      firstName: firstName ? firstName.trim() : null,
      lastName: lastName ? lastName.trim() : null,
    });
  }

  _isANumber(value) {
    return new RegExp(this.SESSION_ID_VALIDATION_PATTERN).test(value);
  }

  @action
  checkSessionIdIsValid(event) {
    const { value } = event.target;

    this.sessionIdIsNotANumberMessage = null;
    this.sessionIdStatus = 'default';

    if (value && !this._isANumber(value)) {
      this.sessionIdIsNotANumberMessage = this.intl.t(
        'pages.certification-joiner.form.fields-validation.session-number-error',
      );
      this.sessionIdStatus = 'error';
    }
  }

  @action
  setSessionId(event) {
    this.sessionId = event.target.value;
  }

  @action
  setFirstName(event) {
    this.firstName = event.target.value;
  }

  @action
  setLastName(event) {
    this.lastName = event.target.value;
  }

  @action
  async attemptNext(e) {
    e.preventDefault();
    this._resetErrorMessages();
    let currentCertificationCandidate = null;
    if (this.sessionId && !this._isANumber(this.sessionId)) {
      this.sessionIdIsNotANumberError = this.intl.t(
        'pages.certification-joiner.form.fields-validation.session-number-error',
      );
      document.querySelector('#certificationJoinerSessionId').focus();
      return;
    }
    try {
      currentCertificationCandidate = this.createCertificationCandidate();
      await currentCertificationCandidate.save({ adapterOptions: { joinSession: true, sessionId: this.sessionId } });
      this.args.onStepChange(currentCertificationCandidate.id);
    } catch (error) {
      if (currentCertificationCandidate) {
        currentCertificationCandidate.deleteRecord();
      }

      if (_isLanguageNotSupported(error)) {
        const [currentError] = error.errors;
        const { languageCode } = currentError.meta;
        const userLanguage = this.intl.t(`common.languages.${languageCode}`);
        const NO_BREAK_SPACE = String.fromCharCode(160);
        const availableLanguages = this.V3_CERTIFICATION_SUPPORTED_LANGUAGES.map((code) =>
          this.intl.t(`common.languages.${code}`),
        ).join(`, ${NO_BREAK_SPACE}`);

        this.errorMessage = this.intl.t('pages.certification-joiner.error-messages.language-not-supported', {
          userLanguage,
          availableLanguages,
          htmlSafe: true,
        });
        this.errorMessageLink = {
          label: this.intl.t('pages.certification-joiner.error-messages.language-not-supported-link'),
          url: 'https://app.pix.org/mon-compte/langue',
        };
      } else if (_isMatchingReconciledStudentNotFoundError(error)) {
        this.errorMessage = this.intl.t('pages.certification-joiner.error-messages.wrong-account-sco');
        this.errorMessageLink = {
          label: this.intl.t('pages.certification-joiner.error-messages.wrong-account-sco-link.label'),
          url: this.intl.t('pages.certification-joiner.error-messages.wrong-account-sco-link.url'),
        };
      } else if (_isWrongAccount(error)) {
        this.errorMessage = this.intl.t('pages.certification-joiner.error-messages.wrong-account');
      } else if (_isSessionNotAccessibleError(error)) {
        this.errorMessage = this.intl.t('pages.certification-joiner.error-messages.session-not-accessible');
      } else {
        this.errorMessage = this.intl.t('pages.certification-joiner.error-messages.generic.disclaimer');
        this.errorDetailList = [
          this.intl.t('pages.certification-joiner.error-messages.generic.check-session-number'),
          this.intl.t('pages.certification-joiner.error-messages.generic.check-personal-info'),
        ];
      }
    }
  }

  @action
  handleDayInputChange(event) {
    const { value } = event.target;

    if (value.length === 2) {
      document.getElementById('certificationJoinerMonthOfBirth').focus();
    }
  }

  @action
  setDayOfBirth(event) {
    this.dayOfBirth = event.target.value;
  }

  @action
  setMonthOfBirth(event) {
    this.monthOfBirth = event.target.value;
  }

  @action
  setYearOfBirth(event) {
    this.yearOfBirth = event.target.value;
  }

  @action
  handleMonthInputChange(event) {
    const { value } = event.target;

    if (value.length === 2) {
      document.getElementById('certificationJoinerYearOfBirth').focus();
    }
  }

  @action
  handleInputFocus(value, event) {
    event.target.select();
  }

  _resetErrorMessages() {
    this.errorMessage = null;
    this.errorDetailList = [];
    this.errorMessageLink = null;
  }
}
