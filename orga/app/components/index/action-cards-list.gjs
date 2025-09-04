import { t } from 'ember-intl';
<template>
  <section>
    <h2 class="action-cards-list__title">{{t "components.index.action-cards.title"}}</h2>
    <div class="action-cards-list">
      {{yield}}
    </div>
  </section>
</template>
