import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import Location from 'mon-pix/utils/location';

import MarkdownToHtml from '../../../../markdown-to-html';

export default class EvaluationResultsCustomOrganizationBlock extends Component {
  @service pixMetrics;

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
    this.pixMetrics.trackEvent('Présence d’un bouton comportant un lien externe', {
      disabled: true,
      category: 'Fin de parcours',
      action: "Affichage du bloc de l'organisation",
    });
  }

  @action
  handleCustomButtonClick() {
    this.pixMetrics.trackEvent('Clic sur le lien externe', {
      disabled: true,
      category: 'Fin de parcours',
      action: "Affichage du bloc de l'organisation",
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
          @variant="primary"
          onclick={{this.handleCustomButtonClick}}
        >
          {{@campaign.customResultPageButtonText}}
        </PixButtonLink>
      {{/if}}
    </div>
  </template>
}

function buildUrl(customUrl, params) {
  let url;
  try {
    url = new URL(customUrl);
  } catch {
    url = new URL(customUrl, Location.getOrigin());
  }
  const urlParams = new URLSearchParams(url.search);
  for (const key in params) {
    if (params[key] !== undefined) {
      urlParams.set(key, params[key]);
    }
  }
  url.search = urlParams.toString();
  return url.toString();
}
