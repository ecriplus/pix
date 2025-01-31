import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import TrainingCard from '../../../../training/card';

export default class EvaluationResultsTabsTrainings extends Component {
  @service currentUser;
  @service metrics;
  @service campaignParticipationResult;

  @tracked isShareResultsLoading = false;
  @tracked isShareResultsError = false;

  constructor() {
    super(...arguments);

    this.metrics.add({
      event: 'custom-event',
      'pix-event-category': 'Fin de parcours',
      'pix-event-action': 'Affichage onglet',
      'pix-event-name': "Affichage de l'onglet Formations",
    });
  }

  get canShareResults() {
    return this.args.isSharableCampaign && !this.args.isParticipationShared;
  }

  @action
  async shareResults() {
    try {
      this.isShareResultsError = false;
      this.isShareResultsLoading = true;

      const campaignParticipationResultToShare = this.args.campaignParticipationResult;
      await this.campaignParticipationResult.share(campaignParticipationResultToShare, this.args.questResults);

      campaignParticipationResultToShare.isShared = true;
      campaignParticipationResultToShare.canImprove = false;

      this.metrics.add({
        event: 'custom-event',
        'pix-event-category': 'Fin de parcours',
        'pix-event-action': 'Envoi des résultats',
        'pix-event-name': "Envoi des résultats depuis l'onglet Formations",
      });
    } catch {
      this.isShareResultsError = true;
    } finally {
      this.isShareResultsLoading = false;
    }
  }

  <template>
    <div
      class="evaluation-results-tab__trainings
        {{if this.canShareResults 'evaluation-results-tab__trainings--with-modal'}}"
    >
      <div
        class="evaluation-results-tab__trainings-content"
        inert={{if this.canShareResults "true"}}
        role={{if this.canShareResults "presentation"}}
      >
        <h2 class="evaluation-results-tab__title">{{t "pages.skill-review.tabs.trainings.title"}}</h2>
        <p class="evaluation-results-tab__description">{{t "pages.skill-review.tabs.trainings.description"}}</p>

        <ul class="evaluation-results-tab__trainings-list">
          {{#each @trainings as |training|}}
            <li class="evaluation-results-tab__training">
              <TrainingCard @training={{training}} />
            </li>
          {{/each}}
        </ul>
      </div>

      {{#if this.canShareResults}}
        <div class="evaluation-results-tab__share-results-modal" role="dialog">
          <div class="evaluation-results-tab-share-results-modal__content">
            <p>{{t "pages.skill-review.tabs.trainings.modal.content" htmlSafe=true}}</p>
            <PixButton @triggerAction={{this.shareResults}} @isLoading={{this.isShareResultsLoading}}>
              {{t "pages.skill-review.actions.send"}}
            </PixButton>
            {{#if this.isShareResultsError}}
              <PixNotificationAlert @type="error" @withIcon={{true}}>
                {{t "pages.skill-review.tabs.trainings.modal.share-error"}}
              </PixNotificationAlert>
            {{/if}}
          </div>
        </div>
      {{/if}}
    </div>
  </template>
}
