import t from 'ember-intl/helpers/t';
import InaccessibleContent from 'mon-pix/components/inaccessible-content';
<template>
  <InaccessibleContent class="inaccessible-campaign">
    <:title>{{t "pages.campaign.errors.existing-participation"}}</:title>
    <:content>
      <p class="inaccessible-campaign__message">
        {{t
          "pages.campaign.errors.existing-participation-user-info"
          firstName=@model.firstName
          lastName=@model.lastName
        }}
      </p>
      <p class="inaccessible-campaign__message">
        {{t "pages.campaign.errors.existing-participation-info"}}
      </p>
    </:content>
  </InaccessibleContent>
</template>
