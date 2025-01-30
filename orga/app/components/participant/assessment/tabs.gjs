import { array } from '@ember/helper';
import { LinkTo } from '@ember/routing';
import { t } from 'ember-intl';

<template>
  <div class="panel participant-tabs">
    <nav class="navbar" aria-label={{t "navigation.assessment-individual-results.aria-label"}}>
      <LinkTo
        @route="authenticated.campaigns.participant-assessment.results"
        @models={{array @campaignId @participationId}}
        class="navbar-item"
      >
        {{t "pages.assessment-individual-results.tab.results"}}
      </LinkTo>
      <LinkTo
        @route="authenticated.campaigns.participant-assessment.analysis"
        @models={{array @campaignId @participationId}}
        class="navbar-item"
      >
        {{t "pages.assessment-individual-results.tab.review"}}
      </LinkTo>
    </nav>
  </div>
</template>
