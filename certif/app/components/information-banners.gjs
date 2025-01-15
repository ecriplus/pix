import PixBannerAlert from '@1024pix/pix-ui/components/pix-banner-alert';

import textWithMultipleLang from '../helpers/text-with-multiple-lang.js';

<template>
  {{#each @banners as |banner|}}
    <PixBannerAlert @type={{banner.severity}} @canCloseBanner={{false}}>
      {{textWithMultipleLang banner.message}}
    </PixBannerAlert>
  {{/each}}
</template>
