import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isEmpty from 'lodash/isEmpty';

export default class CertificationRoute extends Route {
  @service store;
  @service pixToast;
  @service intl;

  async model() {
    let dates;

    try {
      dates = await this.store.findAll('sco-blocked-access-date');
    } catch (errorResponse) {
      if (!isEmpty(errorResponse?.errors)) {
        const isNotFoundError = errorResponse.errors.some((error) => error.status === '404');
        if (isNotFoundError) {
          this.pixToast.sendWarningNotification({
            message: this.intl.t('pages.administration.certification.sco-blocked-access-date.not-found'),
          });
        } else {
          errorResponse.errors.forEach((error) =>
            this.pixToast.sendErrorNotification({ message: error.detail || error.title }),
          );
        }
      }
      dates = [];
    }

    const version = await this.store.queryRecord('certification-version', {
      scope: 'CORE',
    });
    return {
      scoBlockedAccessDates: dates,
      certificationVersion: version,
    };
  }
}
