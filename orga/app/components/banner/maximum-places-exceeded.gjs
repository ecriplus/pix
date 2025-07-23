import PixBannerAlert from '@1024pix/pix-ui/components/pix-banner-alert';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class MaximumPlacesExceeded extends Component {
  @service store;

  get displayMaximumPlacesExceededBanner() {
    const statistics = this.store.peekAll('organization-place-statistic')?.[0];
    return statistics?.hasReachedMaximumPlacesLimit;
  }

  <template>
    {{#if this.displayMaximumPlacesExceededBanner}}
      <PixBannerAlert @type="error">
        {{t
          "banners.maximum-places-exceeded.message"
          htmlSafe=true
          linkClasses="link link--banner link--bold link--underlined"
        }}
      </PixBannerAlert>
    {{/if}}
  </template>
}
