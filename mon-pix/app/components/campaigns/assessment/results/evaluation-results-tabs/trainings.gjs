import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import TrainingCard from '../../../../training/card';

export default class EvaluationResultsTabsTrainings extends Component {
  @service currentUser;
  @service pixMetrics;
  @service store;

  constructor() {
    super(...arguments);

    this.pixMetrics.trackEvent("Affichage de l'onglet Formations", {
      disabled: true,
      category: 'Fin de parcours',
      action: 'Affichage onglet',
    });
  }

  <template>
    <div class="evaluation-results-tab__trainings">
      <div class="evaluation-results-tab__trainings-content">
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

    </div>
  </template>
}
