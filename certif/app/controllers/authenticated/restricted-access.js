import Controller from '@ember/controller';
import { service } from '@ember/service';

import { dayjsUtcFormat } from '../../helpers/dayjs-utc-format';

export default class RestrictedAccessController extends Controller {
  @service intl;

  get certificationOpeningDate() {
    if (this.model.isAccessBlockedCollege) {
      return this.intl.t('pages.sco.restricted-access.title-access', {
        date: dayjsUtcFormat([this.model.pixCertifScoBlockedAccessDateCollege, 'DD/MM/YYYY'], {}),
      });
    }

    if (this.model.isAccessBlockedLycee || this.model.isAccessBlockedAEFE || this.model.isAccessBlockedAgri) {
      return this.intl.t('pages.sco.restricted-access.title-access', {
        date: dayjsUtcFormat([this.model.pixCertifScoBlockedAccessDateLycee, 'DD/MM/YYYY'], {}),
      });
    }

    return null;
  }
}
