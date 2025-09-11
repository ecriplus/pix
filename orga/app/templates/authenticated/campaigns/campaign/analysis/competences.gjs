import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AnalysisPerCompetence from 'pix-orga/components/analysis/analysis-per-competence';

<template>
  {{pageTitle (t "pages.campaign-analysis.title")}}
  <AnalysisPerCompetence @data={{@model.analysisData}} />
</template>
