import { LinkTo } from '@ember/routing';
import { t } from 'ember-intl';

<template>
  <nav class="mission-navigation__tabs" aria-label={{t "pages.missions.mission.tabs.aria-label"}}>
    <LinkTo @route="authenticated.missions.mission.activities" class="navbar-item">
      {{t "pages.missions.mission.tabs.activities"}}
    </LinkTo>
    <LinkTo @route="authenticated.missions.mission.results" class="navbar-item">
      {{t "pages.missions.mission.tabs.results"}}
    </LinkTo>
  </nav>
</template>
