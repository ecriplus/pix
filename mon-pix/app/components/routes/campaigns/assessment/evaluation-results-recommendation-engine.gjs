import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import EvaluationResultsTabs from '../../../campaigns/assessment/results/evaluation-results-tabs';
import QuitResults from '../../../campaigns/assessment/results/quit-results';
import EvaluationResultsHeroRecommendationEngine from '../../../campaigns/assessment/results-recommendation-engine/evaluation-results-hero-recommendation-engine';

export default class EvaluationResultsRecommendationEngine extends Component {
  @service media;
  @service tabManager;

  get hasTrainings() {
    return Boolean(this.trainings.length);
  }

  get trainings() {
    if (this.args.model.campaign.isPartOfCombinedCourse) {
      return [];
    } else {
      return this.args.model.trainings;
    }
  }

  @action
  showTrainings() {
    const tabElement = document.querySelector('[role="tablist"]');
    const tabElementTopPosition = tabElement.getBoundingClientRect().top;

    window.scrollTo({
      top: tabElementTopPosition,
      behavior: 'smooth',
    });

    this.tabManager.setActiveTab(2);
  }

  <template>
    <main role="main" class="evaluation-results-recommendation-engine">
      <header class="evaluation-results__header">
        <img class="evaluation-results-header__logo" src="/images/pix-logo-dark.svg" alt="{{t 'common.pix'}}" />
        <h1 class="evaluation-results-header__title">
          {{#unless this.media.isMobile}}
            <span>{{@model.campaign.title}}</span>
          {{/unless}}
          <span class="sr-only">{{t "pages.skill-review.abstract-title"}}</span>
        </h1>
        <QuitResults />
      </header>
      <EvaluationResultsHeroRecommendationEngine
        @campaign={{@model.campaign}}
        @campaignParticipationResult={{@model.campaignParticipationResult}}
        @questResults={{@model.questResults}}
        @hasTrainings={{this.hasTrainings}}
        @showTrainings={{this.showTrainings}}
      />
      <EvaluationResultsTabs
        @campaign={{@model.campaign}}
        @campaignParticipationResult={{@model.campaignParticipationResult}}
        @questResults={{@model.questResults}}
        @trainings={{this.trainings}}
      />
    </main>
  </template>
}
