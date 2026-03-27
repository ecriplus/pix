import PixBreadcrumb from '@1024pix/pix-ui/components/pix-breadcrumb';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import PixPlusCertificate from '../candidate-certificate/v3-pix-plus-certificate';
import CandidateGlobalLevel from '../certificate-information/candidate-global-level';
import CandidateInformation from '../certificate-information/candidate-information';
import CleaCertification from '../certificate-information/clea-certification';
import CompetencesDetails from '../certificate-information/competences-details';

export default class v3Certificate extends Component {
  @service intl;

  get links() {
    return [
      {
        route: 'fill-in-certificate-verification-code',
        label: this.intl.t('pages.fill-in-certificate-verification-code.title'),
      },
      {
        label: this.args.certificate.title,
      },
    ];
  }

  get isPixPlusFramework() {
    return this.args.certificate.certificationFramework?.toLowerCase().startsWith('edu') ?? false;
  }

  <template>
    <section class="global-page-header global-page-header__breadcrumb">
      <PixBreadcrumb @links={{this.links}} />

      <h1 class="global-page-header__title">
        {{@certificate.title}}
      </h1>
    </section>

    <section class="v3-shareable-certificate">
      {{#if this.isPixPlusFramework}}
        <PixPlusCertificate @certificate={{@certificate}} />
      {{else}}
        <CandidateInformation @certificate={{@certificate}} />
        <CandidateGlobalLevel @certificate={{@certificate}} />
        <section class="v3-candidate-certificate__complementary">
          {{#if @certificate.resultCompetenceTree}}
            <CompetencesDetails @certificate={{@certificate}} />
          {{/if}}

          {{#if @certificate.acquiredComplementaryCertification}}
            <CleaCertification @certificate={{@certificate}} />
          {{/if}}
        </section>
      {{/if}}
    </section>
  </template>
}
