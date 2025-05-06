import t from 'ember-intl/helpers/t';
import AppLayout from 'mon-pix/components/global/app-layout';
import PageTitle from 'mon-pix/components/ui/page-title';
import UserCertificationsPanel from 'mon-pix/components/user-certifications-panel';
<template>
  <AppLayout>
    <main id="main" role="main" class="global-page-container">
      <PageTitle>
        <:title> {{t "pages.certifications-list.title"}}</:title>
        <:subtitle>{{t "pages.user-tests.description"}}</:subtitle>
      </PageTitle>

      <UserCertificationsPanel @certifications={{@model}} />
    </main>
  </AppLayout>
</template>
