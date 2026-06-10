import { t } from 'ember-intl';

import TrainingCard from './training/card';

<template>
  <h2 class="results-recommendation-engine-training__title">{{t
      "pages.skill-review.recommended-engine.trainings.title"
    }}</h2>
  <p class="results-recommendation-engine-training__description">{{t
      "pages.skill-review.recommended-engine.trainings.description"
    }}</p>

  <ul class="results-recommendation-engine-training__list">
    {{#each @trainings as |training|}}
      <li><TrainingCard
          @training={{training}}
          @onCardClick={{@onCardClick}}
          @onModalButtonClick={{@onModalButtonClick}}
        /></li>
    {{/each}}
  </ul>
</template>
