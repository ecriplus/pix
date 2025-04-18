import { t } from 'ember-intl';

import CandidateGlobalLevel from '../certificate-information/candidate-global-level';
import CandidateInformation from '../certificate-information/candidate-information';
import CompetencesDetails from '../certificate-information/competences-details';

<template>
  <section class="global-page-header">
    <h1 class="global-page-header__title">
      {{t "pages.certificate.title"}}
    </h1>
  </section>

  <CandidateInformation @certificate={{@certificate}} />

  <CandidateGlobalLevel @certificate={{@certificate}} />

  <CompetencesDetails @resultCompetenceTree={{@certificate.resultCompetenceTree}} />
</template>
