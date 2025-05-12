import t from 'ember-intl/helpers/t';
import UserCertificationsPanel from 'mon-pix/components/certifications/list/user-certifications-panel';
import PageTitle from 'mon-pix/components/ui/page-title';

<template>
  <main id="main" role="main" class="global-page-container">
    <PageTitle>
      <:title>{{t "pages.certifications-list.title"}}</:title>
      <:subtitle>{{t "pages.certifications-list.description"}}</:subtitle>
    </PageTitle>

    <UserCertificationsPanel @certifications={{@model}} />
  </main>
</template>
