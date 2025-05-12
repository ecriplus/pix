import t from 'ember-intl/helpers/t';
import PageTitle from 'mon-pix/components/ui/page-title';
import UserCertificationsPanel from 'mon-pix/components/user-certifications-panel';

<template>
  <main id="main" role="main" class="global-page-container">
    <PageTitle>
      <:title>{{t "pages.certifications-list.title"}}</:title>
      <:subtitle>{{t "pages.certifications-list.description"}}</:subtitle>
    </PageTitle>

    <UserCertificationsPanel @certifications={{@model}} />
  </main>
</template>
