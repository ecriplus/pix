import Component from '@glimmer/component';
import includes from 'lodash/includes';
import { assessmentResultStatus, assessmentStates } from 'pix-admin/models/certification';

export default class CertificationStatusComponent extends Component {
  get isStatusBlocking() {
    const blockingStatuses = [
      assessmentStates.STARTED,
      assessmentResultStatus.ERROR,
      assessmentStates.ENDED_BY_SUPERVISOR,
    ];
    return includes(blockingStatuses, this.args.record.status) || this.args.record.isFlaggedAborted;
  }

  <template>
    <span class="{{if this.isStatusBlocking 'certification-list-page__cell--important'}}">
      {{@record.statusLabel}}
    </span>
  </template>
}
