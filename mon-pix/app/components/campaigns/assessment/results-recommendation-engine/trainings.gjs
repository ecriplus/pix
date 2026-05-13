import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class EvaluationResultsRecommendationEngineTrainings extends Component {
  <template>
    <h2 class="results-recommendation-engine-training__title">{{t "pages.skill-review.recommended-engine.trainings.title"}}</h2>
    <p class="results-recommendation-engine-training__description">{{t "pages.skill-review.recommended-engine.trainings.description"}}</p>

    <ul class="results-recommendation-engine-training__list">
      {{#each @trainings as |training|}}
        <li></li>
      {{/each}}
    </ul>
  </template>
}
