import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import get from 'lodash/get';

export default class DetailsController extends Controller {
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
      let message;
      switch (error?.status) {
        case '413':
          message = this.intl.t(I18N_KEY_ERROR_MESSAGES[error?.status], {
            maxSizeInMegaBytes: error?.meta?.maxSizeInMegaBytes,
          });
          break;
        default:
          message = this.intl.t(I18N_KEY_ERROR_MESSAGES['default']);
      }
      this.pixToast.sendErrorNotification({ message });
    }
  }

  @action
  async archiveOrganization() {
    try {
      await this.model.save({ adapterOptions: { archiveOrganization: true } });

      this.pixToast.sendSuccessNotification({
        message: this.intl.t(
          'components.organizations.information-section-view.archive-organization.notifications.success',
        ),
      });
      this.router.transitionTo('authenticated.organizations.get');
    } catch (responseError) {
      const status = get(responseError, 'errors[0].status');
      const errorCode = get(responseError, 'errors[0].code');
      if (errorCode === 'ARCHIVE_ORGANIZATION_ERROR') {
        return this.pixToast.sendErrorNotification({
          message: this.intl.t('pages.organization.get.archiving.notifications.active-places-lot-error'),
        });
      }
      if (status === '422') {
        return this.pixToast.sendErrorNotification({
          message: this.intl.t(
            'components.organizations.information-section-view.archive-organization.notifications.error',
          ),
        });
      }
      this.pixToast.sendErrorNotification({ message: this.intl.t('common.notifications.generic-error') });
    }
  }
}

const I18N_KEY_ERROR_MESSAGES = {
  413: 'pages.organizations.notifications.errors.payload-too-large',
  default: 'common.notifications.generic-error',
};
