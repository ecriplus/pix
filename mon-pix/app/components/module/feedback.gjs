import PixButton from '@1024pix/pix-ui/components/pix-button';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import { htmlUnsafe } from '../../helpers/html-unsafe';

export default class ModulixFeedback extends Component {
  @service featureToggles;

  get type() {
    return this.args.answerIsValid ? 'success' : 'error';
  }

  <template>
    <div class="feedback feedback--{{this.type}}">
      {{#if @feedback.state}}
        <div class="feedback__state">{{htmlUnsafe @feedback.state}}</div>
      {{/if}}
      {{htmlUnsafe @feedback.diagnosis}}

      {{#if this.featureToggles.featureToggles.isModulixIssueReportDisplayed}}
        <PixButton
          class="feedback__report-button"
          @variant="tertiary"
          @iconBefore="flag"
          aria-label={{t "pages.modulix.issue-report.aria-label"}}
        >{{t "pages.modulix.issue-report.button"}}</PixButton>
      {{/if}}
    </div>
  </template>
}
