import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import CertificationBanner from 'mon-pix/components/certification-banner';

export default class CertificationEnder extends Component {
  @service currentUser;

  <template>
    <CertificationBanner @certificationNumber={{@certificationNumber}} />

    <PixBlock class="certification-ender">
      <div class="certification-ender__finished-test">
        <img
          src="/images/illustrations/certification-ender/test-completed.svg"
          alt
          class="certification-ender-finished-test__image"
        />
        <div class="certification-ender-finished-test__candidate">
          <p class="certification-ender-candidate__name">
            <PixIcon @name="userCircle" @plainIcon={{true}} @ariaHidden={{true}} />
            {{this.currentUser.user.fullName}}
          </p>
          <h1 class="certification-ender-candidate__title">{{t "pages.certification-ender.candidate.title"}}</h1>
          {{#if @isEndedBySupervisor}}
            <p class="certification-ender-candidate__message">
              {{t "pages.certification-ender.candidate.ended-by-supervisor"}}
            </p>
          {{/if}}
          {{#if @hasBeenEndedDueToFinalization}}
            <p class="certification-ender-candidate__message">
              {{t "pages.certification-ender.candidate.ended-due-to-finalization"}}
            </p>
          {{/if}}
          <PixButtonLink @route="logout" @variant="primary">
            {{t "pages.certification-ender.candidate.disconnect"}}
          </PixButtonLink>
          <p class="certification-ender-candidate__disconnect-tip">
            {{t "pages.certification-ender.candidate.disconnect-tip"}}
          </p>
          <PixNotificationAlert @withIcon="true" class="certification-ender-candidate__remote-certification">
            {{t "pages.certification-ender.candidate.remote-certification"}}
          </PixNotificationAlert>
        </div>
      </div>

      <div class="certification-ender__results">
        <h2 class="certification-ender-results__disclaimer">{{t "pages.certification-ender.results.disclaimer"}}</h2>
        <p class="certification-ender-results__title">
          {{t "pages.certification-ender.results.title"}}
        </p>
        <p class="certification-ender-results__steps">{{t "pages.certification-ender.results.step-1"}}</p>
        <p class="certification-ender-results__steps">{{t "pages.certification-ender.results.step-2"}}</p>
      </div>
    </PixBlock>
  </template>
}
