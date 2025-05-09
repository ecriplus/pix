import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import ProfileContent from 'mon-pix/components/profile-content';
<template>
  {{pageTitle (t "pages.profile.title")}}

  <ProfileContent @model={{@model}} />
</template>
