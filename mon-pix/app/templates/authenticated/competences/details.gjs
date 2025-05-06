import pageTitle from 'ember-page-title/helpers/page-title';
import ScorecardDetails from 'mon-pix/components/scorecard-details';
<template>
  {{pageTitle @model.name}}

  <main id="main" class="competence-details global-page-container" role="main">
    <ScorecardDetails @scorecard={{@model}} />
  </main>
</template>
