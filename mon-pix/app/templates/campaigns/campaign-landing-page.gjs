import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import LandingPageStartBlock from 'mon-pix/components/autonomous-course/landing-page-start-block';
import CampaignStartBlock from 'mon-pix/components/campaign-start-block';
import LocaleSwitcher from 'mon-pix/components/locale-switcher';

<template>
  {{pageTitle (t "pages.campaign-landing.title")}}

  <div class="background-banner-wrapper">
    <main class="campaign-landing-page__container" role="main">
      {{#if @controller.isAutonomousCourse}}
        <LandingPageStartBlock
          @campaign={{@model}}
          @startCampaignParticipation={{@controller.startCampaignParticipation}}
        />
      {{else}}
        <CampaignStartBlock
          @campaign={{@model}}
          @startCampaignParticipation={{@controller.startCampaignParticipation}}
        />
      {{/if}}

      {{#if @controller.shouldDisplayLocaleSwitcher}}
        <div>
          <LocaleSwitcher />
        </div>
      {{/if}}
    </main>
  </div>
</template>
