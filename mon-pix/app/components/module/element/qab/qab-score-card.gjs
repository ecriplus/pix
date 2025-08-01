import { t } from 'ember-intl';

<template>
  <div class="qab-card qab-score-card">
    <div class="qab-card__container">
      <h1 class="qab-score-card__title">
        {{t "pages.modulix.qab.score.title"}}
      </h1>
      <h2 class="qab-score-card__subtitle">
        {{t "pages.modulix.qab.score.yourScore" score=@score total=@total}}
      </h2>
    </div>
  </div>
</template>
