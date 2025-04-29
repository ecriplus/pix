import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import Steps from 'mon-pix/components/campaigns/assessment/tutorial/steps';
<template>
  {{pageTitle (t "pages.tutorial.title")}}

  <div class="campaign-tutorial">
    <main id="main" class="rounded-panel rounded-panel--strong campaign-tutorial__container" role="main">

      <h1 class="sr-only">{{t "pages.tutorial.title"}}</h1>

      <Steps @campaignCode={{@model.campaignCode}} />
    </main>
  </div>
</template>
