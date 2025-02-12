import CampaignBadgeAcquisitions from '../charts/campaign-badge-acquisitions';
import ParticipantsByMasteryPercentage from './participants-by-mastery-percentage';
import ParticipantsByStage from './participants-by-stage';

<template>
  <div class="stats">
    {{#if @campaign.hasStages}}
      <ParticipantsByStage @campaignId={{@campaign.id}} @onSelectStage={{@onSelectStage}} class="participants" />
    {{else}}
      <ParticipantsByMasteryPercentage @campaignId={{@campaign.id}} class="participants hide-on-mobile" />
    {{/if}}
    {{#if @campaign.hasBadges}}
      <CampaignBadgeAcquisitions @campaignId={{@campaign.id}} />
    {{/if}}
  </div>
</template>
