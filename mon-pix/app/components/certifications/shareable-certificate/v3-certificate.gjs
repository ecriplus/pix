import { t } from 'ember-intl';

import CandidateInformation from '../certificate-information/candidate-information';

<template>
  <section class="global-page-header">
    <h1 class="global-page-header__title">
      {{t "pages.certificate.title"}}
    </h1>
  </section>

  <CandidateInformation @certificate={{@certificate}} />

  {{#each @certificate.resultCompetenceTree.areas as |area|}}
    {{#each area.resultCompetences as |resultCompetence|}}
      <p>{{resultCompetence.name}}</p>
    {{/each}}
  {{/each}}
</template>
