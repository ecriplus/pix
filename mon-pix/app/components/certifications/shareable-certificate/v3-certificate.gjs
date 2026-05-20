import Component from '@glimmer/component';

import CandidateGlobalLevel from '../certificate-information/candidate-global-level';
import CandidateInformation from '../certificate-information/candidate-information';
import CleaCertification from '../certificate-information/clea-certification';
import CompetencesDetails from '../certificate-information/competences-details';
import PixPlusCertificate from './v3-pix-plus-certificate';

export default class v3Certificate extends Component {
  get isPixPlusFramework() {
    return !['CORE', 'CLEA'].includes(this.args.certificate.certificationFramework);
  }

  <template>
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
