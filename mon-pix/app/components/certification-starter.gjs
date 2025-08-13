import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixCode from '@1024pix/pix-ui/components/pix-code';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixLabel from '@1024pix/pix-ui/components/pix-label';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import t from 'ember-intl/helpers/t';

export default class CertificationStarter extends Component {
  <template>
    <section class="certification-starter">
      <h1 class="certification-start-page__title">{{t "pages.certification-start.first-title"}}</h1>

      {{#if @certificationCandidateSubscription.displaySubscriptionInformation}}
        <div class="certification-starter-subscriptions">
          <div class="certification-starter-subscriptions-container">
            <p class="certification-starter-subscriptions-container-title">
              {{t "pages.certification-start.core-and-complementary-subscriptions"}}
            </p>
            <span class="certification-starter-subscriptions-container-items__{{this.eligibilityState}}">
              <PixIcon
                @name="checkCircle"
                @plainIcon={{true}}
                @ariaHidden={{true}}
                class="certification-starter-subscriptions-container-items__{{this.eligibilityState}}-icon"
              />
              {{this.complementarySubscriptionLabel}}
            </span>
          </div>
          {{#unless @certificationCandidateSubscription.isEligibleToDoubleCertification}}
            <PixNotificationAlert @type="warning" @withIcon={{true}}>
              {{t
                "pages.certification-start.non-eligible-subscription"
                complementarySubscriptionLabel=this.complementarySubscriptionLabel
              }}
            </PixNotificationAlert>
          {{/unless}}
        </div>
      {{/if}}

      <form class="certification-start-page__form" autocomplete="off">
        <PixLabel for="certificationStarterSessionCode" @requiredLabel={{t "common.form.mandatory"}}>
          {{t "pages.certification-start.access-code"}}
        </PixLabel>
        <PixCode
          @id="certificationStarterSessionCode"
          @length="6"
          @requiredLabel={{true}}
          @value={{this.inputAccessCode}}
          @validationStatus={{this.validationStatus}}
          @errorMessage={{this.validationErrorMessage}}
          {{on "keyup" this.clearErrorMessage}}
          {{on "input" this.handleAccessCodeInput}}
        />

        {{#if this.apiErrorMessage}}
          <PixNotificationAlert @type="error" class="certification-start-page__error-message">
            {{this.apiErrorMessage}}
          </PixNotificationAlert>
        {{/if}}
        {{#if this.technicalErrorInformation}}
          <details class="certification-start-page__information">
            <summary>{{t "pages.certification-start.error-messages.unknown.summary-label"}}</summary>
            <p>{{this.technicalErrorInformation}}</p>
          </details>
        {{/if}}

        <PixButton @type="submit" @triggerAction={{this.submit}} class="certification-start-page__field-button">
          {{t "pages.certification-start.actions.submit"}}
        </PixButton>
      </form>

      <div class="certification-start-page__cgu">
        <p>
          {{t "pages.certification-start.cgu.info"}}
        </p>
        <p>
          {{t "pages.certification-start.cgu.contact.info"}}
          <a href="mailto:{{t 'pages.certification-start.cgu.contact.email'}}">{{t
              "pages.certification-start.cgu.contact.email"
            }}</a>.
        </p>
      </div>
    </section>
  </template>
  @service store;
  @service router;
  @service currentUser;
  @service intl;
  @service focusedCertificationChallengeWarningManager;
  @service pixCompanion;

  @tracked inputAccessCode = '';
  @tracked apiErrorMessage = null;
  @tracked validationErrorMessage = null;
  @tracked technicalErrorInformation = null;
  @tracked classNames = [];
  @tracked certificationCourse = null;
  @tracked validationStatus = 'default';

  get accessCode() {
    return this.inputAccessCode.toUpperCase();
  }

  get complementarySubscriptionLabel() {
    return this.args.certificationCandidateSubscription.enrolledDoubleCertificationLabel;
  }

  get eligibilityState() {
    return this.args.certificationCandidateSubscription.isEligibleToDoubleCertification ? 'eligible' : 'non-eligible';
  }

  @action
  handleAccessCodeInput(event) {
    this.inputAccessCode = event.target.value;
  }

  @action
  clearErrorMessage() {
    this.apiErrorMessage = null;
    this.validationStatus = 'default';
    this.validationErrorMessage = null;
    this.technicalErrorInformation = null;
  }

  @action
  async submit(e) {
    e.preventDefault();
    this.clearErrorMessage();

    if (!this.accessCode) {
      this.validationStatus = 'error';
      this.validationErrorMessage = this.intl.t('pages.certification-start.error-messages.missing-code');
      return;
    }

    const newCertificationCourse = this.store.createRecord('certification-course', {
      accessCode: this.accessCode,
      sessionId: this.args.certificationCandidateSubscription.sessionId,
    });
    try {
      await newCertificationCourse.save();
      this.focusedCertificationChallengeWarningManager.reset();
      this.router.replaceWith('authenticated.certifications.resume', newCertificationCourse.id);
      this.pixCompanion.startCertification();
    } catch (error) {
      newCertificationCourse.deleteRecord();
      const statusCode = error.errors?.[0]?.status;
      if (statusCode === '404') {
        this.apiErrorMessage = this.intl.t('pages.certification-start.error-messages.access-code-error');
      } else if (statusCode === '412') {
        this.apiErrorMessage = this.intl.t('pages.certification-start.error-messages.session-not-accessible');
      } else if (statusCode === '403') {
        const errorCode = error.errors?.[0]?.code;
        if (errorCode === 'CANDIDATE_NOT_AUTHORIZED_TO_JOIN_SESSION') {
          this.apiErrorMessage = this.intl.t(
            'pages.certification-start.error-messages.candidate-not-authorized-to-start',
          );
        } else if (errorCode === 'CANDIDATE_NOT_AUTHORIZED_TO_RESUME_SESSION') {
          this.apiErrorMessage = this.intl.t(
            'pages.certification-start.error-messages.candidate-not-authorized-to-resume',
          );
        } else if (errorCode === 'CENTER_HABILITATION_ERROR') {
          this.apiErrorMessage = this.intl.t('pages.certification-joiner.error-messages.missing-center-habilitation');
        }
      } else {
        // This should not happen, but in case it does, let give as much info as possible
        this.technicalErrorInformation = `${error.message} ${error.stack}`;
        this.apiErrorMessage = this.intl.t('pages.certification-start.error-messages.generic');
      }
    }
  }
}
