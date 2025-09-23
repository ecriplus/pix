import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixLabel from '@1024pix/pix-ui/components/pix-label';
import PixTextarea from '@1024pix/pix-ui/components/pix-textarea';
import { fn, not } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export default class SessionEditionFormComponent extends Component {
  @service router;
  @service intl;
  @service pixToast;

  @tracked isSessionDateMissing;
  @tracked isSessionTimeMissing;
  @tracked address;
  @tracked room;
  @tracked examiner;

  get todayDate() {
    return new Date().toISOString().split('T')[0];
  }

  get isUpdateMode() {
    return !!this.args.session?.id;
  }

  @action
  async submitSession(event) {
    event.preventDefault();
    if (this.checkMissingSessionFields())
      return this.pixToast.sendErrorNotification({ message: this.intl.t('common.form-errors.fill-mandatory-fields') });

    try {
      await this.args.session.save();
    } catch (responseError) {
      const error = responseError?.errors?.[0];

      if (error?.code) {
        return this.pixToast.sendErrorNotification({ message: this.intl.t(`common.api-error-messages.${error.code}`) });
      }
      if (this.isUpdateMode && this._isEntityUnprocessable(responseError)) {
        return this.pixToast.sendErrorNotification({
          message: this.intl.t('common.api-error-messages.bad-request-error'),
        });
      }
      if (!this.isUpdateMode && error?.status === '400') {
        return this.pixToast.sendErrorNotification({
          message: this.intl.t('common.api-error-messages.bad-request-error'),
        });
      }
      return this.pixToast.sendErrorNotification({
        message: this.intl.t('common.api-error-messages.internal-server-error'),
      });
    }

    this.router.transitionTo('authenticated.sessions.details', this.args.session.id);
  }

  @action
  cancel() {
    this.isSessionDateMissing = false;
    this.isSessionTimeMissing = false;

    if (this.isUpdateMode) {
      this.router.transitionTo('authenticated.sessions.details', this.args.session.id);
    } else {
      this.router.transitionTo('authenticated.sessions');
    }
  }

  @action
  onChangeAddress(event) {
    this.args.session.address = event.target.value;
  }

  @action
  onChangeRoom(event) {
    this.args.session.room = event.target.value;
  }

  @action
  onDateChange(event) {
    this.args.session.date = event.target.value;
    this.isSessionDateMissing = false;
  }

  @action
  onTimeChange(event) {
    this.args.session.time = event.target.value;
    this.isSessionTimeMissing = false;
  }

  @action
  onChangeExaminer(event) {
    this.args.session.examiner = event.target.value;
  }

  @action
  onChangeDescription(event) {
    this.args.session.description = event.target.value;
  }

  @action
  validateInput(input) {
    this[input] = null;
    const value = this.args.session[input];

    const isInvalidInput = isEmpty(value?.trim());
    if (isInvalidInput) {
      this[input] = this.intl.t(`pages.sessions.new.errors.SESSION_${input.toUpperCase()}_REQUIRED`);
    }
  }

  checkMissingSessionFields() {
    this.isSessionDateMissing = !this.args.session.date;
    this.isSessionTimeMissing = !this.args.session.time;

    return (
      this.isSessionDateMissing ||
      this.isSessionTimeMissing ||
      !this.args.session.address?.trim() ||
      !this.args.session.room?.trim() ||
      !this.args.session.examiner?.trim()
    );
  }

  _isEntityUnprocessable(err) {
    const status = get(err, 'errors[0].status');
    return status === '422' || status === '400';
  }

  <template>
    <div>
      <form {{on 'submit' this.submitSession}} class='session-form'>
        <p class='session-form__mandatory-information'>
          {{t 'common.forms.mandatory-fields' htmlSafe=true}}
        </p>

        <PixInput
          @id='session-address'
          @requiredLabel={{t 'common.forms.required'}}
          maxlength='255'
          @errorMessage={{this.address}}
          @validationStatus={{if this.address 'error' 'default'}}
          {{on 'focusout' (fn this.validateInput 'address')}}
          {{on 'change' this.onChangeAddress}}
          @value={{if this.isUpdateMode @session.address ''}}
        >
          <:label>{{t 'common.forms.session-labels.center-name'}}</:label>
        </PixInput>

        <PixInput
          @id='session-room'
          @requiredLabel={{t 'common.forms.required'}}
          maxlength='255'
          @errorMessage={{this.room}}
          @validationStatus={{if this.room 'error' 'default'}}
          {{on 'focusout' (fn this.validateInput 'room')}}
          {{on 'change' this.onChangeRoom}}
          @value={{if this.isUpdateMode @session.room ''}}
        >
          <:label>{{t 'common.forms.session-labels.room-name'}}</:label>
        </PixInput>

        <div class='session-form__field {{if this.isSessionDateMissing "session-form__field--error"}}'>
          <PixLabel @requiredLabel={{t 'common.forms.required'}} for='session-date'>
            {{t 'common.forms.session-labels.date-start'}}
          </PixLabel>
          <input
            id='session-date'
            type='date'
            name='session-date'
            class='input input--small'
            aria-describedby='date-error'
            min={{if this.isUpdateMode null this.todayDate}}
            value={{if this.isUpdateMode @session.date ''}}
            {{on 'change' this.onDateChange}}
          />

          <p id='date-error' class='session-form__error error-message'>
            {{#if this.isSessionDateMissing}}
              {{t 'pages.sessions.new.errors.SESSION_DATE_REQUIRED'}}
            {{/if}}
          </p>
        </div>

        <div class='session-form__field {{if this.isSessionTimeMissing "session-form__field--error"}}'>
          <PixLabel @requiredLabel={{t 'common.forms.required'}} for='session-time'>
            {{t 'common.forms.session-labels.time-start'}}
          </PixLabel>
          <input
            id='session-time'
            type='time'
            name='session-time'
            class='input input--small'
            aria-describedby='time-error'
            value={{if this.isUpdateMode @session.time ''}}
            {{on 'change' this.onTimeChange}}
          />
          <p id='time-error' class='session-form__error error-message'>
            {{#if this.isSessionTimeMissing}}
              {{t 'pages.sessions.new.errors.SESSION_TIME_REQUIRED'}}
            {{/if}}
          </p>
        </div>

        <PixInput
          @id='session-examiner'
          @requiredLabel={{t 'common.forms.required'}}
          maxlength='255'
          @errorMessage={{this.examiner}}
          @validationStatus={{if this.examiner 'error' 'default'}}
          {{on 'focusout' (fn this.validateInput 'examiner')}}
          {{on 'change' this.onChangeExaminer}}
          @value={{if this.isUpdateMode @session.examiner ''}}
        >
          <:label>{{t 'common.forms.session-labels.invigilator'}}</:label>
        </PixInput>

        <PixTextarea
          @id='session-description'
          @maxlength='350'
          class='session-form__textarea'
          value={{if this.isUpdateMode @session.description ''}}
          {{on 'change' this.onChangeDescription}}
        >
          <:label>{{t 'common.forms.session-labels.observations'}}</:label>
        </PixTextarea>

        <ul class='session-form__actions'>
          <li>
            <PixButton
              data-test-id='session-form__cancel-button'
              @variant='secondary'
              @triggerAction={{this.cancel}}
              @isBorderVisible='true'
              aria-label={{t
                (if
                  this.isUpdateMode
                  'pages.sessions.update.actions.cancel-extra-information'
                  'pages.sessions.new.actions.cancel-extra-information'
                )
              }}
            >
              {{t 'common.actions.cancel'}}
            </PixButton>
          </li>
          <li>
            <PixButton @type='submit'>
              {{t
                (if
                  this.isUpdateMode
                  'pages.sessions.update.actions.edit-session'
                  'pages.sessions.new.actions.create-session'
                )
              }}
            </PixButton>
          </li>
        </ul>
      </form>
    </div>
  </template>
}
