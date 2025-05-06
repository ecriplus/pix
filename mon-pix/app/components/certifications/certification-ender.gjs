import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import CertificationBanner from 'mon-pix/components/certification-banner';

export default class CertificationEnder extends Component {
  <template>
    <CertificationBanner @certificationNumber={{@certificationNumber}} />

    <div class="certification-ender rounded-panel result-content">

      <div class="certification-ender__finished-test">
        <img
          src="/images/illustrations/certification-ender/test-completed.svg"
          alt
          class="certification-ender__image"
        />
        <div class="certification-ender__candidate">
          <p class="certification-ender__candidate-name">
            <PixIcon @name="userCircle" @plainIcon={{true}} @ariaHidden={{true}} />
            {{this.currentUser.user.fullName}}
          </p>
          <h1 class="certification-ender__candidate-title">{{t "pages.certification-ender.candidate.title"}}</h1>
          {{#if @isEndedBySupervisor}}
            <div class="certification-ender__candidate-message">
              {{t "pages.certification-ender.candidate.ended-by-supervisor"}}
            </div>
          {{/if}}
          {{#if @hasBeenEndedDueToFinalization}}
            <div class="certification-ender__candidate-message">
              {{t "pages.certification-ender.candidate.ended-due-to-finalization"}}
            </div>
          {{/if}}
          <PixButtonLink @route="logout" @variant="primary" class="certification-ender__candidate-action-disconnect">
            {{t "pages.certification-ender.candidate.disconnect"}}
          </PixButtonLink>
          <div class="certification-ender__candidate-disconnect-tip">
            {{t "pages.certification-ender.candidate.disconnect-tip"}}
          </div>
          <PixNotificationAlert @withIcon="true" class="certification-ender__remote-certification">
            {{t "pages.certification-ender.candidate.remote-certification"}}
          </PixNotificationAlert>
        </div>
      </div>
      <div class="certification-ender__results">
        <img
          src="/images/illustrations/certification-ender/results-example.svg"
          alt
          class="certification-ender__results-example"
        />
        <div class="certification-ender__results-instructions">
          <div class="certification-ender__results-disclaimer">{{t
              "pages.certification-ender.results.disclaimer"
            }}</div>
          <div class="certification-ender__results-title">
            {{t "pages.certification-ender.results.title"}}
          </div>
          <div class="certification-ender__results-steps">{{t "pages.certification-ender.results.step-1"}}</div>
          <div class="certification-ender__results-steps">{{t "pages.certification-ender.results.step-2"}}</div>
        </div>
      </div>
    </div>
  </template>
  @service currentUser;
}
