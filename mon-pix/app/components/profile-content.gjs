import t from 'ember-intl/helpers/t';
import HexagonScore from 'mon-pix/components/hexagon-score';
import ProfileScorecards from 'mon-pix/components/profile-scorecards';
import PageTitle from 'mon-pix/components/ui/page-title';
<template>
  <main id="main" class="profile-scorecards global-page-container" role="main">
    <PageTitle>
      <:title>{{t "pages.profile.title"}}</:title>
      <:subtitle>{{t "pages.profile.description"}}</:subtitle>
      <:extraContent>
        <HexagonScore
          @pixScore={{@model.profile.pixScore}}
          @maxReachablePixScore={{@model.profile.maxReachablePixScore}}
          @maxReachableLevel={{@model.profile.maxReachableLevel}}
        />
      </:extraContent>
      <:extraContentTitle>{{t "pages.profile.accessibility.user-score"}}</:extraContentTitle>
    </PageTitle>

    {{#if @model.profile.scorecards}}
      <ProfileScorecards
        @interactive={{true}}
        @areas={{@model.profile.areas}}
        @scorecards={{@model.profile.scorecards}}
      />
    {{else}}
      <p class="app-loader__image">
        <img src="/images/interwind.gif" alt />
        <br />{{t "common.loading.default"}}
      </p>
    {{/if}}
  </main>
</template>
