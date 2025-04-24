import PixBreadcrumb from '@1024pix/pix-ui/components/pix-breadcrumb';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import CandidateGlobalLevel from '../certificate-information/candidate-global-level';
import CandidateInformation from '../certificate-information/candidate-information';
import CompetencesDetails from '../certificate-information/competences-details';

export default class v3Certificate extends Component {
  @service intl;

  get breadcrumbLinks() {
    return [
      {
        route: 'authenticated.user-certifications',
        label: this.intl.t('pages.certifications-list.title'),
      },
      {
        label: this.intl.t('pages.certificate.title'),
      },
    ];
  }

  <template>
    <section class="global-page-header global-page-header__breadcrumb">
      <PixBreadcrumb @links={{this.breadcrumbLinks}} />

      <h1 class="global-page-header__title">
        {{t "pages.certificate.title"}}
      </h1>
    </section>

    <section class="v3-certificate">
      <CandidateInformation @certificate={{@certificate}} />

      <CandidateGlobalLevel @certificate={{@certificate}} />

      {{#if @certificate.resultCompetenceTree}}
        <CompetencesDetails @resultCompetenceTree={{@certificate.resultCompetenceTree}} />
      {{/if}}
    </section>
  </template>
}
