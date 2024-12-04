import PixBannerAlert from '@1024pix/pix-ui/components/pix-banner-alert';
import { fn } from '@ember/helper';
import { t } from 'ember-intl';

import getService from '../../helpers/get-service.js';

function shouldDisplayBanner(session) {
  const localeNotSupported = session?.data?.localeNotSupported;
  const localeNotSupportedBannerClosed = session?.data?.localeNotSupportedBannerClosed;

  return localeNotSupported && !localeNotSupportedBannerClosed;
}

<template>
  {{#let (getService "service:session") as |session|}}
    {{#if (shouldDisplayBanner session)}}
      <PixBannerAlert
        @type="information"
        @canCloseBanner="true"
        @onCloseBannerTriggerAction={{fn session.updateDataAttribute "localeNotSupportedBannerClosed" true}}
      >
        {{t "banners.language-availability.message"}}
      </PixBannerAlert>
    {{/if}}
  {{/let}}
</template>
