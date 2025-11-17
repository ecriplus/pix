import t from 'ember-intl/helpers/t';
import InaccessibleCampaign from 'mon-pix/components/inaccessible-campaign';
<template>
  <InaccessibleCampaign class="inaccessible-campaign">
    <:default>{{t "pages.campaign.errors.existing-participation"}}</:default>
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
  </InaccessibleCampaign>
</template>
