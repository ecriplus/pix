import { t } from 'ember-intl';
<template>
  <nav
    class="module-navbar"
    aria-label={{t "pages.modulix.flashcards.navigation.currentStep" current=@currentStep total=@totalSteps}}
  >
    <div class="module-navbar__content">
      <div class="module-navbar__content__current-step">
        {{@currentStep}}/{{@totalSteps}}
      </div>
    </div>
  </nav>
</template>
