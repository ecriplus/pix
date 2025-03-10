import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ChallengeActions extends Component {
  @tracked isValidateActionLoading = false;
  @tracked isSkipActionLoading = false;

  get areActionButtonsDisabled() {
    return this.args.disabled || this.hasCurrentOngoingLiveAlert;
  }

  get isNotCertification() {
    return !this.args.isCertification;
  }

  get isV2Certification() {
    return this.args.certificationVersion === 2;
  }

  get isV3CertificationAdjustedForAccessibility() {
    return this.args.certificationVersion === 3 && this.args.isAdjustedCourseForAccessibility;
  }

  get isV3CertificationNotAdjusted() {
    return this.args.certificationVersion === 3 && !this.args.isAdjustedCourseForAccessibility;
  }

  get hasCurrentOngoingLiveAlert() {
    return this.args.hasOngoingCompanionLiveAlert || this.args.hasOngoingChallengeLiveAlert;
  }

  @action
  async handleValidateAction(event) {
    this.isValidateActionLoading = true;

    try {
      await this.args.validateAnswer(event);
    } finally {
      this.isValidateActionLoading = false;
    }
  }

  @action
  async handleSkipAction() {
    this.isSkipActionLoading = true;

    try {
      await this.args.skipChallenge();
    } finally {
      this.isSkipActionLoading = false;
    }
  }
}
