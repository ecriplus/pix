import t from 'ember-intl/helpers/t';
import Issue from 'junior/components/issue';
<template>
  {{! Cette page est affichée lorsqu'on souhaite aller sur une URL qui n'existe pas coté front }}
  <Issue @message={{t "pages.not-found.message"}} />
</template>
