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
  @service moduleIssueReport;

  @action
  onReportClick() {
    this.showModal = true;
  }

  @action
  hideModal() {
    this.showModal = false;
  }

  @action
  onSend({ categoryKey, comment }) {
    this.moduleIssueReport.record({
      categoryKey,
      comment,
      elementId: this.args.reportInfo.elementId,
      answer: this.args.reportInfo.answer,
    });
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

      <ModulixIssueReportModal
        @elementType={{@reportInfo.elementType}}
        @showModal={{this.showModal}}
        @hideModal={{this.hideModal}}
        @onSendReport={{this.onSend}}
      />
    {{/if}}
  </template>
}
