import Controller from '@ember/controller';
import { service } from '@ember/service';
import dayjs from 'dayjs';

export default class RestrictedAccessController extends Controller {
  @service intl;

  get certificationOpeningDate() {
    if (this.model.isAccessBlockedCollege) {
      return this.model.pixCertifScoBlockedAccessDateCollege;
    }

    if (this.model.isAccessBlockedLycee || this.model.isAccessBlockedAEFE || this.model.isAccessBlockedAgri) {
      return this.model.pixCertifScoBlockedAccessDateLycee;
    }

    return null;
  }

  get accessBlockedLabel() {
    return this.intl.t('restricted-access', {
      date: dayjs(this.model.pixCertifBlockedAccessUntilDate).format('DD/MM/YYYY'),
    });
  }
}
