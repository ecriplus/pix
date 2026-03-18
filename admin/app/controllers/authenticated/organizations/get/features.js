import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import get from 'lodash/get';

export default class FeaturesController extends Controller {
  @service pixToast;
  @service router;
  @service accessControl;
  @service intl;

  @action
  async updateOrganizationInformation() {
    try {
      await this.model.save();
      this.pixToast.sendSuccessNotification({
        message: this.intl.t('components.organizations.information-section-view.update.notifications.success'),
      });
      this.router.transitionTo('authenticated.organizations.get');
    } catch (responseError) {
      this.model.rollbackAttributes();
      const error = get(responseError, 'errors[0]');
      const message =
        error?.status === '413'
          ? this.intl.t('pages.organizations.notifications.errors.payload-too-large', {
              maxSizeInMegaBytes: error?.meta?.maxSizeInMegaBytes,
            })
          : this.intl.t('common.notifications.generic-error');
      this.pixToast.sendErrorNotification({ message });
    }
  }
}
