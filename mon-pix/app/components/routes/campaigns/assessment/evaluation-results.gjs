import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import ENV from 'mon-pix/config/environment';

import EvaluationResultsHero from '../../../campaigns/assessment/results/evaluation-results-hero';
import EvaluationResultsTabs from '../../../campaigns/assessment/results/evaluation-results-tabs';
import QuitResults from '../../../campaigns/assessment/results/quit-results';

export default class EvaluationResults extends Component {
  @service tabManager;

  get hasTrainings() {
    return Boolean(this.args.model.trainings.length);
  }

  get isSharableCampaign() {
    const isAutonomousCourse = this.args.model.campaign.organizationId === ENV.APP.AUTONOMOUS_COURSES_ORGANIZATION_ID;
    return !isAutonomousCourse && !this.args.model.campaign.isForAbsoluteNovice;
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
    <main role="main" class="evaluation-results">
      <header class="evaluation-results__header">
        <img class="evaluation-results-header__logo" src="/images/pix-logo-dark.svg" alt="{{t 'common.pix'}}" />
        <h1 class="evaluation-results-header__title">
          <span>{{@model.campaign.title}}</span>
          <span class="sr-only">{{t "pages.skill-review.abstract-title"}}</span>
        </h1>
        <QuitResults
          @isCampaignShared={{@model.campaignParticipationResult.isShared}}
          @isSharableCampaign={{this.isSharableCampaign}}
        />
      </header>
      <EvaluationResultsHero
        @campaign={{@model.campaign}}
        @campaignParticipationResult={{@model.campaignParticipationResult}}
        @questResults={{@model.questResults}}
        @hasTrainings={{this.hasTrainings}}
        @showTrainings={{this.showTrainings}}
        @isSharableCampaign={{this.isSharableCampaign}}
      />
      <EvaluationResultsTabs
        @campaign={{@model.campaign}}
        @campaignParticipationResult={{@model.campaignParticipationResult}}
        @questResults={{@model.questResults}}
        @isSharableCampaign={{this.isSharableCampaign}}
        @trainings={{@model.trainings}}
      />
    </main>
  </template>
}
