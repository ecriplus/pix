import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class CertificationStarter extends Component {
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
    return this.args.certificationCandidateSubscription.eligibleSubscriptions.find(
      (subscription) => subscription.type === 'COMPLEMENTARY',
    ).label;
  }

  get subscriptionTitle() {
    const { isSessionVersion3, isV3CoreAndComplementary } = this.args.certificationCandidateSubscription;

    const complementaryAlone = isSessionVersion3 && !isV3CoreAndComplementary;
    const intlSuffix = complementaryAlone ? 'complementary-subscription' : 'core-and-complementary-subscriptions';

    return this.intl.t(`pages.certification-start.${intlSuffix}`);
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
        }
      } else {
        // This should not happen, but in case it does, let give as much info as possible
        this.technicalErrorInformation = `${error.message} ${error.stack}`;
        this.apiErrorMessage = this.intl.t('pages.certification-start.error-messages.generic');
      }
    }
  }
}
