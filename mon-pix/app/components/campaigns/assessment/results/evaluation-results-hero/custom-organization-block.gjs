import Component from '@glimmer/component';
import EndCourseCustomButton from 'mon-pix/components/campaigns/assessment/results/evaluation-results-hero/end-course-custom-button';

import MarkdownToHtml from '../../../../markdown-to-html';

export default class EvaluationResultsCustomOrganizationBlock extends Component {
  get hasCustomButtonUrl() {
    return this.args.campaign.customResultPageButtonUrl && this.args.campaign.customResultPageButtonText;
  }

  <template>
    <div class="evaluation-results-hero__organization-block">
      {{#if @campaign.customResultPageText}}
        <MarkdownToHtml
          @class="evaluation-results-hero-organization-block__message"
          @markdown={{@campaign.customResultPageText}}
        />
      {{/if}}
      {{#if this.hasCustomButtonUrl}}
        <EndCourseCustomButton
          @buttonLink={{@campaign.customResultPageButtonUrl}}
          @buttonText={{@campaign.customResultPageButtonText}}
          @masteryRate={{@campaignParticipationResult.masteryRate}}
          @participantExternalId={{@campaignParticipationResult.participantExternalId}}
          @reachedStage={{@campaignParticipationResult.reachedStage}}
        />
      {{/if}}
    </div>
  </template>
}
