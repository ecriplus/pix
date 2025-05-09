import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import Grid from 'mon-pix/components/campaign-participation-overview/grid';
import PageTitle from 'mon-pix/components/ui/page-title';
<template>
  {{pageTitle (t "pages.user-tests.title")}}

  <main id="main" role="main" class="global-page-container">
    <PageTitle>
      <:title> {{t "pages.user-tests.title"}}</:title>
      <:subtitle>{{t "pages.user-tests.description"}}</:subtitle>
    </PageTitle>

    <Grid @model={{@controller.model}} />
  </main>
</template>
