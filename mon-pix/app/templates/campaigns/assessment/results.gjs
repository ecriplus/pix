import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import EvaluationResults from 'mon-pix/components/routes/campaigns/assessment/evaluation-results';
import EvaluationResultsRecommendationEngine
  from 'mon-pix/components/routes/campaigns/assessment/evaluation-results-recommendation-engine';

<template>
  {{pageTitle (t "pages.skill-review.title")}}
  {{#if @model.campaign.recommendationEngine}}
    <EvaluationResultsRecommendationEngine @model={{@model}} />
  {{else}}
    <EvaluationResults @model={{@model}} />
  {{/if}}
</template>
