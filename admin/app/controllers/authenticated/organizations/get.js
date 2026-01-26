import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import get from 'lodash/get';

export default class GetController extends Controller {
  @service pixToast;
  @service router;
  @service accessControl;
  @service intl;

  @action
  async updateOrganizationInformation() {
    try {
      await this.model.save();
      this.pixToast.sendSuccessNotification({ message: "L'organisation a bien été modifiée." });
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

      this.pixToast.sendSuccessNotification({ message: 'Cette organisation a bien été archivée.' });
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
        return this.pixToast.sendErrorNotification({ message: "L'organisation n'a pas pu être archivée." });
      }
      this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }
  }
}

const I18N_KEY_ERROR_MESSAGES = {
  413: 'pages.organizations.notifications.errors.payload-too-large',
  default: 'common.notifications.generic-error',
};
