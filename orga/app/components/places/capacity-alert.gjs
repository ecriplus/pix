import PixBannerAlert from '@1024pix/pix-ui/components/pix-banner-alert';
import { t } from 'ember-intl';
import { gt } from 'ember-truth-helpers';

<template>
  {{#if (gt @occupied @total)}}
    <PixBannerAlert class="capacity-alert" @type="error" @withIcon="true">
      {{t "banners.over-capacity.message"}}
    </PixBannerAlert>
  {{/if}}
</template>
