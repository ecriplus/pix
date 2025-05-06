import Card from 'mon-pix/components/campaign-participation-overview/card';
<template>
  <ul class="campaign-participation-overview-grid">
    {{#each @model as |campaignParticipationOverview|}}
      <li class="campaign-participation-overview-grid__item">
        <Card @model={{campaignParticipationOverview}} />
      </li>
    {{/each}}
  </ul>
</template>
