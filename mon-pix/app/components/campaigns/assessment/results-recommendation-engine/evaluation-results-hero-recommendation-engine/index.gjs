import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixStars from '@1024pix/pix-ui/components/pix-stars';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import AcquiredBadgesCompact from './acquired-badges-compact';

export default class EvaluationResultsHeroRecommendationEngine extends Component {
  @service currentUser;
  @service pixMetrics;

  get masteryRatePercentage() {
    return Math.round(this.args.campaignParticipationResult.masteryRate * 100);
  }

  get hasStagesStars() {
    return (
      this.args.campaignParticipationResult.hasReachedStage &&
      this.args.campaignParticipationResult.reachedStage.totalStage > 1
    );
  }

  get reachedStage() {
    return {
      acquired: this.args.campaignParticipationResult.reachedStage.reachedStage - 1,
      total: this.args.campaignParticipationResult.reachedStage.totalStage - 1,
    };
  }

  get isUserAnonymous() {
    return this.currentUser?.user?.isAnonymous;
  }

  @action handleSeeTrainingsClick() {
    this.args.showTrainings();
  }

  @action handleBackToHomepageDisplay() {
    this.pixMetrics.trackEvent(
      "Affichage du bouton 'Revenir à la page d'accueil dans le cadre du moteur de recommandation'",
      {
        disabled: true,
        category: 'Fin de parcours',
        action: 'Sortie de parcours',
      },
    );
  }

  @action handleBackToHomepageClick() {
    this.pixMetrics.trackEvent("Clic sur le bouton 'Revenir à la page d'accueil'", {
      disabled: true,
      category: 'Fin de parcours',
      action: 'Sortie de parcours',
    });
  }

  <template>
    <div class="evaluation-results-hero-recommendation-engine">
      <div class="evaluation-results-hero-recommendation-engine__content">
        <h2 class="evaluation-results-hero-recommendation-engine__title">
          {{t "pages.skill-review.hero.thanks" name=this.currentUser.user.firstName}}
        </h2>

        <p class="evaluation-results-hero-recommendation-engine__percent">
          <strong class="evaluation-results-hero-recommendation-engine__percent-value">
            {{this.masteryRatePercentage}}<span class="evaluation-results-hero-recommendation-engine__percent-unit">
              %</span>
          </strong>
          <span class="evaluation-results-hero-recommendation-engine__percent-label">{{t
              "pages.skill-review.hero.mastery-rate"
            }}</span>
        </p>

        {{#if this.hasStagesStars}}
          <div class="evaluation-results-hero-recommendation-engine__stars">
            <PixStars
              @count={{this.reachedStage.acquired}}
              @total={{this.reachedStage.total}}
              @alt={{t
                "pages.skill-review.stage.starsAcquired"
                acquired=this.reachedStage.acquired
                total=this.reachedStage.total
              }}
              @color="yellow"
            />
            <div class="evaluation-results-hero-recommendation-engine__stars-text" aria-hidden="true">
              {{t
                "pages.skill-review.stage.recommendedEngine.starsAcquired"
                acquired=this.reachedStage.acquired
                total=this.reachedStage.total
              }}
            </div>
          </div>
        {{/if}}

        {{#if @campaignParticipationResult.acquiredBadges.length}}
          <AcquiredBadgesCompact @acquiredBadges={{@campaignParticipationResult.acquiredBadges}} />
        {{/if}}

        <div class="evaluation-results-hero-recommendation-engine__actions">
          {{#if @hasTrainings}}
            <PixButton @triggerAction={{this.handleSeeTrainingsClick}} @size="medium" @variant="secondary">
              {{t "pages.skill-review.hero.see-trainings"}}
            </PixButton>
          {{else}}
            {{this.handleBackToHomepageDisplay}}
            <PixButtonLink
              @route="authentication.login"
              @size="small"
              @variant="secondary-white"
              onclick={{this.handleBackToHomepageClick}}
            >
              {{t "navigation.back-to-homepage"}}
            </PixButtonLink>
          {{/if}}
        </div>
      </div>
    </div>
  </template>
}
