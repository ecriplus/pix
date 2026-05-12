import t from 'ember-intl/helpers/t';
import InaccessibleContent from 'mon-pix/components/inaccessible-content';
<template>
  <InaccessibleContent @buttonText="navigation.back-to-homepage">
    <:title>{{t "pages.combined-courses.errors.disabled.title"}}</:title>
    <:content>{{t "pages.combined-courses.errors.disabled.content"}}</:content>
    <:instructions>{{t "pages.combined-courses.errors.disabled.instructions"}}</:instructions>
  </InaccessibleContent>
</template>
