import PixBannerAlert from '@1024pix/pix-ui/components/pix-banner-alert';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class Banners extends Component {
  @service session;

  get shouldDisplayLocaleNotSupportedBanner() {
    const localeNotSupported = this.session?.data?.localeNotSupported;
    const localeNotSupportedBannerClosed = this.session?.data?.localeNotSupportedBannerClosed;

    return localeNotSupported && !localeNotSupportedBannerClosed;
  }

  @action
  closeLocaleNotSupportedBanner() {
    this.session.updateDataAttribute('localeNotSupportedBannerClosed', true);
  }

  <template>
    {{#if this.shouldDisplayLocaleNotSupportedBanner}}
      <PixBannerAlert
        @type='information'
        @canCloseBanner='true'
        @onCloseBannerTriggerAction={{this.closeLocaleNotSupportedBanner}}
        class='banners'
      >
        {{t 'banners.language-availability.message'}}
      </PixBannerAlert>
    {{/if}}
  </template>
}
