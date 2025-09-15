import AnalysisHeader from 'pix-orga/components/analysis/analysis-header';
import EmptyState from 'pix-orga/components/campaign/empty-state';

<template>
  {{#if @model.campaign.hasSharedParticipations}}
    <AnalysisHeader @model={{@model}} />
    {{outlet}}
  {{else}}
    {{#if @controller.isGarAuthenticationMethod}}
      <EmptyState />
    {{else}}
      <EmptyState
        @campaignCode={{@model.campaign.code}}
        @isFromCombinedCourse={{@model.campaign.isFromCombinedCourse}}
      />
    {{/if}}
  {{/if}}
</template>
