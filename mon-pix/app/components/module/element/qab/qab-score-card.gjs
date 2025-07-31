import { t } from 'ember-intl';

<template>
  <div class="qab-card qab-score-card">
    <div class="qab-card__container">
      <h1 class="qab-score-card__title">
        {{t "pages.modulix.qab.your_score" score=@score total=@total}}
      </h1>
    </div>
  </div>
</template>
