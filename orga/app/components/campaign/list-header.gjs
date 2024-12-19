import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { LinkTo } from '@ember/routing';
import { t } from 'ember-intl';

import PageTitle from '../ui/page-title';

<template>
  <header>
    <PageTitle>
      <:title>
        {{t "pages.campaigns-list.title"}}
      </:title>
      <:tools>
        <PixButtonLink
          @route="authenticated.campaigns.new"
          class="campaign-list-header__create-campaign-button hide-on-mobile"
        >
          {{t "pages.campaigns-list.action.create"}}
        </PixButtonLink>
      </:tools>
    </PageTitle>

    <nav class="panel navbar campaign-list-header__tabs" aria-label={{t "pages.campaigns-list.navigation"}}>
      <ul>
        <li>
          <LinkTo @route="authenticated.campaigns.list.my-campaigns" class="navbar-item">
            {{t "pages.campaigns-list.tabs.my-campaigns"}}
          </LinkTo>
        </li>

        <li>
          <LinkTo @route="authenticated.campaigns.list.all-campaigns" class="navbar-item">
            {{t "pages.campaigns-list.tabs.all-campaigns"}}
          </LinkTo>
        </li>
      </ul>
    </nav>
  </header>
</template>
