import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import DownloadSessionResults from 'mon-pix/components/download-session-results';
import AppLayout from 'mon-pix/components/global/app-layout';
<template>
  {{pageTitle (t "pages.download-session-results.title")}}

  <AppLayout>
    <main role="main">
      <DownloadSessionResults />
    </main>
  </AppLayout>
</template>
