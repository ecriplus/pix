import { t } from 'ember-intl';

import CandidateGlobalLevel from '../certificate-information/candidate-global-level';
import CandidateInformation from '../certificate-information/candidate-information';
import CleaCertification from '../certificate-information/clea-certification';
import CompetencesDetails from '../certificate-information/competences-details';
import DownloadPdf from '../certificate-information/download-pdf';

<template>
  <section class="v3-candidate-certificate">
    <div class="v3-candidate-certificate__information">
      <CandidateInformation @certificate={{@certificate}}>
        {{#if @certificate.globalLevelLabel}}
          <h2 class="v3-candidate-certificate-information__congratulations">
            {{t "pages.certificate.congratulations"}}
          </h2>
          <p
            data-testid="pw-candidate-certificate-global-level"
            class="v3-candidate-certificate-information__global-level-information"
          >
            {{t "pages.certificate.global.explanation.default" globalLevelLabel=@certificate.globalLevelLabel}}
          </p>
        {{else}}
          <h2
            data-testid="pw-candidate-certificate-insufficient-global-level"
            class="v3-candidate-certificate-information__global-level-information"
          >
            {{t "pages.certificate.global.explanation.pre-beginner-level"}}
          </h2>
        {{/if}}
      </CandidateInformation>

      <DownloadPdf @certificate={{@certificate}} />
    </div>

    <CandidateGlobalLevel @certificate={{@certificate}} />

    <section class="v3-candidate-certificate__complementary">
      {{#if @certificate.resultCompetenceTree}}
        <CompetencesDetails @certificate={{@certificate}} />
      {{/if}}

      {{#if @certificate.acquiredComplementaryCertification}}
        <CleaCertification @certificate={{@certificate}} />
      {{/if}}
    </section>
  </section>
</template>
