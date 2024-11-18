import PixBanner from '@1024pix/pix-ui/components/pix-banner';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixMessage from '@1024pix/pix-ui/components/pix-message';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

export default class EvaluationResultsHeroRetryOrResetBlock extends Component {
  @service metrics;

  @tracked isResetModalVisible = false;

  retryQueryParams = { retry: true };
  resetQueryParams = { reset: true };

  constructor() {
    super(...arguments);

    if (this.args.campaignParticipationResult.canRetry) {
      this.metrics.add({
        event: 'custom-event',
        'pix-event-category': 'Fin de parcours',
        'pix-event-action': 'Affichage du bloc RAZ/Repasser un parcours',
        'pix-event-name': "Présence du bouton 'Repasser un parcours'",
      });
    }

    if (this.args.campaignParticipationResult.canReset) {
      this.metrics.add({
        event: 'custom-event',
        'pix-event-category': 'Fin de parcours',
        'pix-event-action': 'Affichage du bloc RAZ/Repasser un parcours',
        'pix-event-name': "Présence du bouton 'Remettre à zéro et tout retenter'",
      });
    }
  }

  @action
  handleRetryClick() {
    this.metrics.add({
      event: 'custom-event',
      'pix-event-category': 'Fin de parcours',
      'pix-event-action': 'Affichage du bloc RAZ/Repasser un parcours',
      'pix-event-name': "Clic sur le bouton 'Repasser mon parcours'",
    });
  }

  @action
  toggleResetModalVisibility() {
    if (!this.isResetModalVisible) {
      this.metrics.add({
        event: 'custom-event',
        'pix-event-category': 'Fin de parcours',
        'pix-event-action': 'Affichage du bloc RAZ/Repasser un parcours',
        'pix-event-name': "Ouverture de la modale 'Remettre à zéro et tout retenter'",
      });
    }

    this.isResetModalVisible = !this.isResetModalVisible;
  }

  @action
  handleResetClick() {
    this.metrics.add({
      event: 'custom-event',
      'pix-event-category': 'Fin de parcours',
      'pix-event-action': 'Affichage du bloc RAZ/Repasser un parcours',
      'pix-event-name': "Confirmation de la modale 'Remettre à zéro et tout retenter'",
    });
  }

  <template>
    <div class="evaluation-results-hero__retry">
      <div class="evaluation-results-hero-retry__content">
        <h2 class="evaluation-results-hero-retry__title">
          {{t "pages.skill-review.hero.retry.title"}}
        </h2>
        <p class="evaluation-results-hero-retry__description">
          {{t "pages.skill-review.hero.retry.description"}}
        </p>
        <div class="evaluation-results-hero-retry__actions">
          {{#if @campaignParticipationResult.canRetry}}
            <PixButtonLink
              @variant="secondary"
              @route="campaigns.entry-point"
              @model={{@campaign.code}}
              @query={{this.retryQueryParams}}
              onclick={{this.handleRetryClick}}
            >
              {{t "pages.skill-review.hero.retry.actions.retry"}}
            </PixButtonLink>
          {{/if}}
          {{#if @campaignParticipationResult.canReset}}
            <PixButton @variant="tertiary" @triggerAction={{this.toggleResetModalVisibility}}>
              {{t "pages.skill-review.hero.retry.actions.reset"}}
            </PixButton>
            <PixModal
              @title={{t "pages.skill-review.reset.button"}}
              @showModal={{this.isResetModalVisible}}
              @onCloseButtonClick={{this.toggleResetModalVisibility}}
            >
              <:content>
                <PixBanner @type="warning">{{t "pages.skill-review.reset.modal.warning-text"}}</PixBanner>
                <p class="reset-campaign-participation-modal__text">
                  {{t
                    "pages.skill-review.reset.modal.text"
                    targetProfileName=@campaign.targetProfileName
                    htmlSafe=true
                  }}
                </p>
              </:content>
              <:footer>
                <div class="reset-campaign-participation-modal__footer">
                  <PixButton @variant="secondary" @triggerAction={{this.toggleResetModalVisibility}}>
                    {{t "common.actions.cancel"}}
                  </PixButton>
                  <PixButtonLink
                    @route="campaigns.entry-point"
                    @model={{@campaign.code}}
                    @query={{this.resetQueryParams}}
                    @variant="error"
                    onclick={{this.handleResetClick}}
                  >
                    {{t "common.actions.confirm"}}
                  </PixButtonLink>
                </div>
              </:footer>
            </PixModal>
          {{/if}}
        </div>
        <PixMessage class="evaluation-results-hero-retry__message" @withIcon={{true}}>
          {{t "pages.skill-review.reset.notifications"}}
        </PixMessage>
      </div>
    </div>
  </template>
}
