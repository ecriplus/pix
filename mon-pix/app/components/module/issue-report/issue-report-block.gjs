import PixButton from '@1024pix/pix-ui/components/pix-button';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import ModulixIssueReportModal from './issue-report-modal';

export default class ModulixIssueReportBlock extends Component {
  @service featureToggles;
  @tracked showModal = false;

  @action
  onReportClick() {
    this.showModal = true;
  }

  @action
  hideModal() {
    this.showModal = false;
  }

  @action
  onSend() {
    // appel API pour créer issue-report
    // ferme la modale
  }

  <template>
    {{#if this.featureToggles.featureToggles.isModulixIssueReportDisplayed}}
      <PixButton
        class="feedback__report-button"
        @variant="tertiary"
        @iconBefore="flag"
        aria-label={{t "pages.modulix.issue-report.aria-label"}}
        @triggerAction={{this.onReportClick}}
      >{{t "pages.modulix.issue-report.button"}}</PixButton>

      <ModulixIssueReportModal @showModal={{this.showModal}} @hideModal={{this.hideModal}} />
    {{/if}}
  </template>
}
