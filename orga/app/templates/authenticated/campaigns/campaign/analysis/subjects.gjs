import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AnalysisPerTube from 'pix-orga/components/analysis/analysis-per-tube';

<template>
  {{pageTitle (t "pages.campaign-analysis.title")}}
  <AnalysisPerTube @data={{@model.analysisData}} />
</template>
