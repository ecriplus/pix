import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import t from 'ember-intl/helpers/t';

export default class CompletedReportsInformationStep extends Component {
  <template>
    <div class='session-finalization-complementary-information-step'>
      <div class='session-finalization-complementary-information-step__content'>
        <PixCheckbox
          @id='session-finalization-complementary-information-step-incident'
          @size='small'
          @checked={{false}}
          {{on 'click' this.onCheckIncidentDuringCertificationSession}}
        >
          <:label>{{t 'pages.session-finalization.complementary-information.incident'}}</:label>
        </PixCheckbox>
        <PixCheckbox
          @id='session-finalization-complementary-information-step-candidates-joining-issue'
          @size='small'
          @checked={{false}}
          {{on 'click' this.onCheckIssueWithJoiningSession}}
        >
          <:label>{{t 'pages.session-finalization.complementary-information.candidates-joining-issue.label'}}</:label>
        </PixCheckbox>

        {{#if this.displayJoiningIssue}}
          <PixNotificationAlert @type='info' @withIcon={{true}}>
            {{t
              'pages.session-finalization.complementary-information.candidates-joining-issue.link'
              htmlSafe=true
              joiningIssueSheetUrl=this.joiningIssueSheetUrl
            }}
          </PixNotificationAlert>
        {{/if}}
      </div>
    </div>
  </template>
  @service url;

  @tracked displayIncidentDuringCertificationSession = false;
  @tracked displayJoiningIssue = false;

  @action
  onCheckIncidentDuringCertificationSession(event) {
    this.displayIncidentDuringCertificationSession = event.target.checked;
    this.args.toggleIncidentDuringCertificationSession(this.displayIncidentDuringCertificationSession);
  }

  @action
  onCheckIssueWithJoiningSession(event) {
    this.displayJoiningIssue = event.target.checked;
    this.args.toggleSessionJoiningIssue(this.displayJoiningIssue);
  }

  get joiningIssueSheetUrl() {
    return this.url.joiningIssueSheetUrl;
  }
}
