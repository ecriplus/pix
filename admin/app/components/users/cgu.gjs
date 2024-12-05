import { service } from '@ember/service';
import Component from '@glimmer/component';
import dayjs from 'dayjs';
import { t } from 'ember-intl';

export default class Cgu extends Component {
  @service accessControl;
  @service intl;

  get userHasValidatePixAppTermsOfService() {
    return this._formatValidatedTermsOfServiceText(this.args.lastTermsOfServiceValidatedAt, this.args.cgu);
  }

  get userHasValidatePixOrgaTermsOfService() {
    return this._formatValidatedTermsOfServiceText(
      this.args.lastPixOrgaTermsOfServiceValidatedAt,
      this.args.pixOrgaTermsOfServiceAccepted,
    );
  }

  get userHasValidatePixCertifTermsOfService() {
    return this._formatValidatedTermsOfServiceText(
      this.args.lastPixCertifTermsOfServiceValidatedAt,
      this.args.pixCertifTermsOfServiceAccepted,
    );
  }
  _formatValidatedTermsOfServiceText(date, hasValidatedTermsOfService) {
    if (!hasValidatedTermsOfService) {
      return this.intl.t('components.users.user-detail-personal-information.cgu.validation.status.non-validated');
    }

    return date
      ? this.intl.t('components.users.user-detail-personal-information.cgu.validation.status.validated-with-date', {
          formattedDate: dayjs(date).format('DD/MM/YYYY'),
        })
      : this.intl.t('components.users.user-detail-personal-information.cgu.validation.status.validated');
  }

  <template>
    <header class="page-section__header">
      <h2 class="page-section__title">{{t "components.users.user-detail-personal-information.cgu.title"}}</h2>
    </header>

    <ul class="cgu__cgu-list">
      <li class="cgu__cgu-information">
        {{t "components.users.user-detail-personal-information.cgu.validation.domain.pix-app"}}
        {{this.userHasValidatePixAppTermsOfService}}</li>

      <li class="cgu__cgu-information">
        {{t "components.users.user-detail-personal-information.cgu.validation.domain.pix-orga"}}
        {{this.userHasValidatePixOrgaTermsOfService}}</li>

      <li class="cgu__cgu-information">
        {{t "components.users.user-detail-personal-information.cgu.validation.domain.pix-certif"}}
        {{this.userHasValidatePixCertifTermsOfService}}</li>
    </ul>
  </template>
}
