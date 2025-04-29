import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AppLayout from 'mon-pix/components/global/app-layout';
import ProfileContent from 'mon-pix/components/profile-content';
<template>
  {{pageTitle (t "pages.profile.title")}}
  <AppLayout>
    <ProfileContent @model={{@model}} />
  </AppLayout>
</template>
