import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import SendProfile from 'mon-pix/components/routes/campaigns/profiles-collection/send-profile';
<template>
  {{pageTitle (t "pages.send-profile.title")}}

  <div class="background-banner-wrapper">
    <div class="background-banner"></div>
    <div class="rounded-panel rounded-panel--strong rounded-panel--over-background-banner send-profile-header">
      <SendProfile
        @isDisabled={{@controller.isDisabled}}
        @user={{@controller.model.user}}
        @campaignParticipation={{@controller.model.campaignParticipation}}
        @campaign={{@controller.model.campaign}}
        @sendProfile={{@controller.sendProfile}}
        @errorMessage={{@controller.errorMessage}}
      />
    </div>
  </div>
</template>
