import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
<template>
  {{pageTitle (t "pages.not-connected.title")}}
  <main class="not-connected" role="main">
    <div class="rounded-panel not-connected__container">
      <img class="pix-logo__image not-connected__logo" src="/images/pix-logo.svg" alt="Pix" />
      <h1 class="sr-only">{{t "pages.not-connected.title"}}</h1>
      <p class="not-connected__text-block">
        {{t "pages.not-connected.message" htmlSafe=true}}
      </p>
    </div>
  </main>
</template>
