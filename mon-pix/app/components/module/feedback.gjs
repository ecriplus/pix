import PixButton from '@1024pix/pix-ui/components/pix-button';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import { htmlUnsafe } from '../../helpers/html-unsafe';
import ModulixIssueReportModal from './issue-report/issue-report-modal';

export default class ModulixFeedback extends Component {
  @service featureToggles;
  @tracked showModal = false;

  get type() {
    return this.args.answerIsValid ? 'success' : 'error';
  }

  @action
  onReportClick() {
    this.showModal = true;
  }

  @action
  hideModal() {
    this.showModal = false;
  }

  <template>
    <div class="feedback feedback--{{this.type}}">
      {{#if @feedback.state}}
        <div class="feedback__state">{{htmlUnsafe @feedback.state}}</div>
      {{/if}}
      {{htmlUnsafe @feedback.diagnosis}}

      {{#if this.featureToggles.featureToggles.isModulixIssueReportDisplayed}}
        <div class="feedback__report-button">
          <PixButton
            @variant="tertiary"
            @iconBefore="flag"
            aria-label={{t "pages.modulix.issue-report.aria-label"}}
            @triggerAction={{this.onReportClick}}
          >{{t "pages.modulix.issue-report.button"}}</PixButton>
        </div>

        <ModulixIssueReportModal @showModal={{this.showModal}} @hideModal={{this.hideModal}} />
      {{/if}}
    </div>
  </template>
}
