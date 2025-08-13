import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { LinkTo } from '@ember/routing';
import { t } from 'ember-intl';

<template>
  <PixNotificationAlert @type="communication-orga" @withIcon={{true}}>
    {{t "banners.import.message"}}
    <ol class="banner-list">
      <li>
        {{t "banners.import.step1a" htmlSafe=true}}
        <LinkTo
          @route="authenticated.import-organization-participants"
          class="link link--banner link--bold link--underlined"
        >
          {{t "banners.import.step1b"}}
        </LinkTo>
        {{t "banners.import.step1c"}}
      </li>
      <li>{{t "banners.import.step2" htmlSafe=true}}</li>
      <li>{{t "banners.import.step3" htmlSafe=true}}</li>
    </ol>
  </PixNotificationAlert>
</template>
