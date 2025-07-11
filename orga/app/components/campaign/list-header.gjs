import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixTabs from '@1024pix/pix-ui/components/pix-tabs';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import PageTitle from '../ui/page-title';

export default class List extends Component {
  @service store;

  get hasReachedPlacesLimit() {
    const statistics = this.store.peekAll('organization-place-statistic')?.[0];
    return statistics?.hasReachedMaximumPlacesLimit;
  }

  get campaignCreationRoute() {
    if (this.hasReachedPlacesLimit) {
      return null;
    }
    return 'authenticated.campaigns.new';
  }

  <template>
    <header>
      <PageTitle>
        <:title>
          {{t "pages.campaigns-list.title"}}
        </:title>
        <:tools>
          <PixButtonLink
            @route={{this.campaignCreationRoute}}
            class="campaign-list-header__create-campaign-button hide-on-mobile"
            @isDisabled={{this.hasReachedPlacesLimit}}
          >
            {{t "pages.campaigns-list.action.create"}}
          </PixButtonLink>
        </:tools>
      </PageTitle>

      <PixTabs @variant="orga" class="campaign-list-header__tabs" @ariaLabel={{t "pages.campaigns-list.navigation"}}>
        <LinkTo @route="authenticated.campaigns.list.my-campaigns">
          {{t "pages.campaigns-list.tabs.my-campaigns"}}
        </LinkTo>
        <LinkTo @route="authenticated.campaigns.list.all-campaigns">
          {{t "pages.campaigns-list.tabs.all-campaigns"}}
        </LinkTo>
      </PixTabs>
    </header>
  </template>
}
