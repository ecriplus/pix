import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AnalysisPerTubesAndCompetences from 'pix-orga/components/analysis/analysis-per-tubes-and-competences';
import GlobalPositioning from 'pix-orga/components/analysis/global-positioning';
import Competences from 'pix-orga/components/campaign/analysis/competences';
import Recommendations from 'pix-orga/components/campaign/analysis/recommendations';
import EmptyState from 'pix-orga/components/campaign/empty-state';

<template>
  {{pageTitle (t "pages.campaign-analysis.title")}}
  {{#if @model.campaign.hasSharedParticipations}}
    {{#if @model.isNewPage}}
      <div class="analysis-description">
        <b class="analysis-description__resume">{{t "pages.campaign-analysis.description.resume"}}</b>
        <p>{{t "pages.campaign-analysis.description.explanation"}}</p>
        <p>{{t "pages.campaign-analysis.description.nota-bene"}}</p>
      </div>
      <GlobalPositioning @data={{@model.analysisData}} />
      <AnalysisPerTubesAndCompetences @data={{@model.analysisData}} />
    {{else}}
      <h2 class="screen-reader-only">{{t "pages.campaign-review.title"}}</h2>
      <Recommendations
        @campaignTubeRecommendations={{@model.campaign.campaignAnalysis.campaignTubeRecommendations}}
        @displayAnalysis={{@model.campaign.hasSharedParticipations}}
      />

      <Competences
        @campaignId={{@model.campaign.id}}
        @campaignCollectiveResult={{@model.campaign.campaignCollectiveResult}}
      />
    {{/if}}

  {{else}}
    {{#if @controller.isGarAuthenticationMethod}}
      <EmptyState />
    {{else}}
      <EmptyState @campaignCode={{@model.campaign.code}} />
    {{/if}}
  {{/if}}
</template>
