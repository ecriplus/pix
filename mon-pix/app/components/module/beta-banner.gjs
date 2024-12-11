import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { t } from 'ember-intl';

<template>
  <PixNotificationAlert @type="communication" @withIcon="true" role="alert">
    {{t "pages.modulix.beta-banner"}}
  </PixNotificationAlert>
</template>
