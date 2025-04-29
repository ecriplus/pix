import PixBackgroundHeader from '@1024pix/pix-ui/components/pix-background-header';
import t from 'ember-intl/helpers/t';
import InaccessibleCampaign from 'mon-pix/components/inaccessible-campaign';
<template>
  <PixBackgroundHeader>
    <InaccessibleCampaign>
      <span class="inaccessible-campaign-message">
        <div>{{t "pages.campaign.errors.existing-participation"}}</div>
        <span>{{t "pages.campaign.errors.existing-participation-user-info"}}</span>
        <span class="inaccessible-campaign-message__username">{{@controller.model.firstName}}
          {{@controller.model.lastName}}.</span>
      </span>
      <span class="inaccessible-campaign-info">
        {{t "pages.campaign.errors.existing-participation-info"}}
      </span>
    </InaccessibleCampaign>
  </PixBackgroundHeader>
</template>
