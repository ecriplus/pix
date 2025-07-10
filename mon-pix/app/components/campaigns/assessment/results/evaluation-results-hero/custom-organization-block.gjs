import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import MarkdownToHtml from '../../../../markdown-to-html';

export default class EvaluationResultsCustomOrganizationBlock extends Component {
  @service metrics;

  get customButtonUrl() {
    if (this.args.campaign.customResultPageButtonUrl && this.args.campaign.customResultPageButtonText) {
      const params = {};

      if (Number.isFinite(this.args.campaignParticipationResult.masteryRate)) {
        params.masteryPercentage = Number(this.args.campaignParticipationResult.masteryRate * 100).toFixed(0);
      }
      params.externalId = this.args.campaignParticipationResult.participantExternalId ?? undefined;
      params.stage = this.args.campaignParticipationResult.reachedStage?.get('threshold') ?? undefined;

      return buildUrl(this.args.campaign.customResultPageButtonUrl, params);
    } else {
      return null;
    }
  }

  @action
  handleCustomButtonDisplay() {
    this.metrics.trackEvent({
      event: 'custom-event',
      'pix-event-category': 'Fin de parcours',
      'pix-event-action': "Affichage du bloc de l'organisation",
      'pix-event-name': 'Présence d’un bouton comportant un lien externe',
    });
  }

  @action
  handleCustomButtonClick() {
    this.metrics.trackEvent({
      event: 'custom-event',
      'pix-event-category': 'Fin de parcours',
      'pix-event-action': "Affichage du bloc de l'organisation",
      'pix-event-name': 'Clic sur le lien externe',
    });
  }

  <template>
    <div class="evaluation-results-hero__organization-block">
      {{#if @campaign.customResultPageText}}
        <MarkdownToHtml
          class="evaluation-results-hero-organization-block__message"
          @isInline={{true}}
          @markdown={{@campaign.customResultPageText}}
        />
      {{/if}}
      {{#if this.customButtonUrl}}
        {{this.handleCustomButtonDisplay}}
        <PixButtonLink
          class="evaluation-results-hero-organization-block__link"
          @href={{this.customButtonUrl}}
          @variant="secondary"
          onclick={{this.handleCustomButtonClick}}
        >
          {{@campaign.customResultPageButtonText}}
        </PixButtonLink>
      {{/if}}
    </div>
  </template>
}

function buildUrl(baseUrl, params) {
  const Url = new URL(baseUrl);
  const urlParams = new URLSearchParams(Url.search);
  for (const key in params) {
    if (params[key] !== undefined) {
      urlParams.set(key, params[key]);
    }
  }
  Url.search = urlParams.toString();
  return Url.toString();
}
