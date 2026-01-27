import t from 'ember-intl/helpers/t';
import Issue from 'junior/components/issue';
<template>
  {{! Cette page est affichée lorsqu'une erreur survient coté api. }}
  <Issue @message={{t "pages.error.message"}} />
</template>
