import PixTabs from '@1024pix/pix-ui/components/pix-tabs';
import { array } from '@ember/helper';
import { LinkTo } from '@ember/routing';
import { t } from 'ember-intl';

<template>
  <div class="participant-tabs">
    <PixTabs @variant="orga" @ariaLabel={{t "navigation.assessment-individual-results.aria-label"}}>
      <LinkTo
        @route="authenticated.campaigns.participant-assessment.results"
        @models={{array @campaignId @participationId}}
      >
        {{t "pages.assessment-individual-results.tab.results"}}
      </LinkTo>
      <LinkTo
        @route="authenticated.campaigns.participant-assessment.analysis"
        @models={{array @campaignId @participationId}}
      >
        {{t "pages.assessment-individual-results.tab.review"}}
      </LinkTo>
    </PixTabs>
  </div>
</template>
