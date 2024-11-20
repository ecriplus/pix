import PixButton from '@1024pix/pix-ui/components/pix-button';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class DeleteAccountSection extends Component {
  @service url;

  get supportHomeUrl() {
    return this.url.supportHomeUrl;
  }

  get hasEmail() {
    return Boolean(this.args.user.email);
  }

  <template>
    <section class="delete-account-section">
      <h2>{{t "pages.user-account.delete-account.title"}}</h2>

      <p>
        {{#if this.hasEmail}}
          {{t
            "pages.user-account.delete-account.warning-email"
            pixScore=@user.profile.pixScore
            email=@user.email
            htmlSafe=true
          }}
        {{else}}
          {{t
            "pages.user-account.delete-account.warning-other"
            pixScore=@user.profile.pixScore
            firstName=@user.firstName
            lastName=@user.lastName
            htmlSafe=true
          }}
        {{/if}}
      </p>

      <p>
        {{t "pages.user-account.delete-account.more-information"}}
        <a href="{{this.supportHomeUrl}}" target="_blank" rel="noopener noreferrer">
          {{t "pages.user-account.delete-account.more-information-contact-support"}}
        </a>
      </p>

      <PixButton @variant="error">
        {{t "pages.user-account.delete-account.actions.delete"}}
      </PixButton>
    </section>
  </template>
}
