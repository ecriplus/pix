import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { t } from 'ember-intl';

<template>
  <PixNotificationAlert @type="communication-orga" @withIcon={{true}}>
    <p>{{t "banners.ia.message"}}</p>
    <ol class="banner-list">
      <li>{{t "banners.ia.step1" htmlSafe=true}}</li>
      <li>{{t "banners.ia.step2" htmlSafe=true}}</li>
    </ol>
  </PixNotificationAlert>
</template>
