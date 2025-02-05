import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from 'mon-pix/config/environment';

export default class FillInCertificateVerificationCode extends Controller {
  @service store;
  @service intl;
  @service router;

  @tracked apiErrorMessage = null;

  @action
  async checkCertificate(certificateVerificationCode) {
    try {
      const certification = await this.store.queryRecord('certification', {
        verificationCode: certificateVerificationCode.toUpperCase(),
      });
      this.router.transitionTo('shared-certification', certification);
    } catch (error) {
      this.onVerificateCertificationCodeError(error);
    }
  }

  @action
  async clearErrors() {
    this.apiErrorMessage = null;
  }

  onVerificateCertificationCodeError(error) {
    if (error.errors) {
      const { status } = error.errors[0];
      if (status === '404') {
        this.apiErrorMessage = this.intl.t('pages.fill-in-certificate-verification-code.errors.not-found');
      } else {
        this.apiErrorMessage = error;
      }
    } else {
      this.apiErrorMessage = this.intl.t(ENV.APP.API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR.I18N_KEY);
    }
  }
}
