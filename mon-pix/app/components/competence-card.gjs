import media from 'ember-responsive/helpers/media';
import CompetenceCardDefault from 'mon-pix/components/competence-card-default';
import CompetenceCardMobile from 'mon-pix/components/competence-card-mobile';
<template>
  {{#if (media "isMobile")}}
    <CompetenceCardMobile @interactive={{@interactive}} @scorecard={{@scorecard}} />
  {{else}}
    <CompetenceCardDefault @interactive={{@interactive}} @scorecard={{@scorecard}} />
  {{/if}}
</template>
