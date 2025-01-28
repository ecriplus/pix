import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class UsersCertificationCenterMembershipsController extends Controller {
  @service pixToast;
  @service store;
  @service intl;

  @action
  async updateCertificationCenterMembershipRole(certificationCenterMembership) {
    try {
      await certificationCenterMembership.save();
      this.pixToast.sendSuccessNotification({
        message: this.intl.t('pages.user-details.notifications.success.update-certification-center-membership-role'),
      });
    } catch {
      certificationCenterMembership.rollbackAttributes();
      this.pixToast.sendErrorNotification({
        message: this.intl.t('pages.user-details.notifications.failure.update-certification-center-membership-role'),
      });
    }
  }

  @action
  async disableCertificationCenterMembership(certificationCenterMembership) {
    try {
      await certificationCenterMembership.destroyRecord();
      this.pixToast.sendSuccessNotification({
        message: this.intl.t('pages.user-details.notifications.success.deactivate-certification-center-membership'),
      });
    } catch {
      this.pixToast.sendErrorNotification({
        message: this.intl.t('pages.user-details.notifications.failure.deactivate-certification-center-membership'),
      });
    }
  }
}
