import Component from '@glimmer/component';

import { htmlUnsafe } from '../../helpers/html-unsafe';
import ModulixIssueReportBlock from './issue-report/issue-report-block';

export default class ModulixFeedback extends Component {
  get type() {
    return this.args.answerIsValid ? 'success' : 'error';
  }

  <template>
    <div class="feedback feedback--{{this.type}}">
      {{#if @feedback.state}}
        <div class="feedback__state">{{htmlUnsafe @feedback.state}}</div>
      {{/if}}
      {{htmlUnsafe @feedback.diagnosis}}

      <div class="feedback__report-button">
        <ModulixIssueReportBlock />
      </div>
    </div>
  </template>
}
