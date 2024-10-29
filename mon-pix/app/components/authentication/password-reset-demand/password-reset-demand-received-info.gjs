import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class PasswordResetDemandReceivedInfo extends Component {
  <template>
    <div class="authentication-password-reset-demand-received-info">
      <img src="/images/mail.svg" alt="" />
      <h2 class="authentication-password-reset-demand-received-info__heading">
        {{t "components.authentication.password-reset-demand-received-info.heading"}}
      </h2>
      <p class="authentication-password-reset-demand-received-info__message">
        {{t "components.authentication.password-reset-demand-received-info.message"}}
      </p>
      <p class="authentication-password-reset-demand-received-info__help">
        {{t "components.authentication.password-reset-demand-received-info.no-email-received-question"}}
        <PixButtonLink
          @variant="tertiary"
          @route="password-reset-demand"
          target="_blank"
          class="authentication-password-reset-demand-form__help-contact-us-link"
        >
          {{t "components.authentication.password-reset-demand-received-info.try-again"}}
        </PixButtonLink>
      </p>
    </div>
  </template>
}
