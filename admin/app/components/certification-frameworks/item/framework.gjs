import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import FrameworkHistory from './framework/framework-history';
import History from './target-profile/history';

export default class CertificationFramework extends Component {
  @service store;
  @tracked targetProfilesHistory;
  @tracked frameworkHistory;

  constructor() {
    super(...arguments);

    this.#onMount();
  }

  async #onMount() {
    const frameworkKey = this.args.frameworkKey;
    const certificationFramework = this.args.certificationFramework;

    if (certificationFramework && this.args.hasTargetProfilesHistory) {
      await certificationFramework.reload();
      this.targetProfilesHistory = certificationFramework.targetProfilesHistory;
    }

    const frameworkHistory = await this.store.queryRecord('framework-history', frameworkKey);
    this.frameworkHistory = frameworkHistory?.history;
  }

  <template>
    {{#if this.frameworkHistory}}
      <FrameworkHistory @history={{this.frameworkHistory}} @scope={{@frameworkKey}} />
    {{/if}}

    {{#if this.targetProfilesHistory}}
      <History @targetProfilesHistory={{this.targetProfilesHistory}} />
    {{/if}}
  </template>
}
