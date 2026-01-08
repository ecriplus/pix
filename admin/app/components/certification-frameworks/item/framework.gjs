import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import FrameworkDetails from './framework/framework-details';
import FrameworkHistory from './framework/framework-history';
import History from './target-profile/history';

export default class CertificationFramework extends Component {
  @service currentUser;
  @service store;
  @tracked targetProfilesHistory;
  @tracked currentConsolidatedFramework;
  @tracked frameworkHistory;

  constructor() {
    super(...arguments);

    this.#onMount();
  }

  async #onMount() {
    const frameworkKey = this.args.frameworkKey;
    const complementaryCertification = this.args.complementaryCertification;

    if (complementaryCertification) {
      await complementaryCertification.reload();
      this.targetProfilesHistory = complementaryCertification.targetProfilesHistory;
    }

    this.currentConsolidatedFramework = await this.store.findRecord(
      'certification-consolidated-framework',
      frameworkKey,
    );

    const frameworkHistory = await this.store.queryRecord('framework-history', frameworkKey);
    this.frameworkHistory = frameworkHistory?.history;
  }

  <template>
    {{#if this.currentUser.adminMember.isSuperAdmin}}
      <PixBlock @variant="admin">
        {{#unless this.currentConsolidatedFramework}}
          <PixNotificationAlert @withIcon={{true}} class="framework__no-current">
            {{t "components.complementary-certifications.item.framework.no-current-framework"}}
          </PixNotificationAlert>
          <br />
        {{/unless}}

        <PixButtonLink
          class="framework__creation-button"
          @route="authenticated.certification-frameworks.item.framework.new"
        >
          {{t "components.complementary-certifications.item.framework.create-button"}}
        </PixButtonLink>
      </PixBlock>
    {{/if}}

    {{#if this.currentConsolidatedFramework}}
      <FrameworkDetails @currentConsolidatedFramework={{this.currentConsolidatedFramework}} />
    {{/if}}

    {{#if this.frameworkHistory}}
      <FrameworkHistory @history={{this.frameworkHistory}} />
    {{/if}}

    {{#if this.targetProfilesHistory}}
      <History @targetProfilesHistory={{this.targetProfilesHistory}} />
    {{/if}}
  </template>
}
