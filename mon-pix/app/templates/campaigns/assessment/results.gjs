import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import EvaluationResults from 'mon-pix/components/routes/campaigns/assessment/evaluation-results';
<template>
  {{pageTitle (t "pages.skill-review.title")}}

  <EvaluationResults @model={{@model}} />
</template>
