import PixBlock from '@1024pix/pix-ui/components/pix-block';
import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AnalysisPerTubeOrCompetence from 'pix-orga/components/analysis/analysis-per-tube-or-competence';
import GlobalPositioning from 'pix-orga/components/analysis/global-positioning';
import EmptyState from 'pix-orga/components/campaign/empty-state';

const levels = [
  'pages.campaign-analysis.levels-correspondence.levels.beginner',
  'pages.campaign-analysis.levels-correspondence.levels.independent',
  'pages.campaign-analysis.levels-correspondence.levels.advanced',
  'pages.campaign-analysis.levels-correspondence.levels.expert',
];

<template>
  {{pageTitle (t "pages.campaign-analysis.title")}}
  {{#if @model.campaign.hasSharedParticipations}}
    <h2 class="result-analysis__title">{{t "pages.campaign-analysis.second-title"}}</h2>
    <div class="analysis-description">
      <b class="analysis-description__resume">{{t "pages.campaign-analysis.description.resume"}}</b>
      <p>{{t "pages.campaign-analysis.description.explanation"}}</p>
      <p>{{t "pages.campaign-analysis.description.nota-bene"}}</p>
    </div>
    <div class="result-analysis__global-information">
      <GlobalPositioning @data={{@model.analysisData}} />
      <PixBlock class="result-analysis__global-positioning-explanation" @variant="orga">
        <h2 class="global-positioning__title">{{t "pages.campaign-analysis.levels-correspondence.title"}}</h2>
        <ul>
          {{#each levels as |levelKey|}}
            <li>{{t levelKey}}</li>
          {{/each}}
        </ul>
        <br />
        <a
          href={{t "pages.campaign-analysis.levels-correspondence.infos.link"}}
          target="_blank"
          rel="noopener noreferrer"
          class="link link--banner link--underlined"
        >
          {{t "pages.campaign-analysis.levels-correspondence.infos.text"}}</a>
      </PixBlock>
    </div>
    <AnalysisPerTubeOrCompetence @data={{@model.analysisData}} />

  {{else}}
    {{#if @controller.isGarAuthenticationMethod}}
      <EmptyState />
    {{else}}
      <EmptyState @campaignCode={{@model.campaign.code}} />
    {{/if}}
  {{/if}}
</template>
