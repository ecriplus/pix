import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import DownloadSessionResults from 'mon-pix/components/download-session-results';

<template>
  {{pageTitle (t "pages.download-session-results.title")}}

  <main role="main">
    <DownloadSessionResults />
  </main>
</template>
