import t from 'ember-intl/helpers/t';
import Panel from 'mon-pix/components/certifications/list/panel';
import PageTitle from 'mon-pix/components/ui/page-title';

<template>
  <main id="main" role="main" class="global-page-container">
    <PageTitle>
      <:title>{{t "pages.certifications-list.title"}}</:title>
      <:subtitle>{{t "pages.certifications-list.description"}}</:subtitle>
    </PageTitle>

    <Panel @certifications={{@model}} />
  </main>
</template>
