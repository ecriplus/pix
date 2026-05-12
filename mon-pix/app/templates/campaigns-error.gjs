import t from 'ember-intl/helpers/t';
import InaccessibleContent from 'mon-pix/components/inaccessible-content';

<template>
  <InaccessibleContent>
    <:title>{{t "pages.campaign.errors.not-accessible"}}</:title>
  </InaccessibleContent>
</template>
