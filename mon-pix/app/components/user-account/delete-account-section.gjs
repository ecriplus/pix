import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

export default class DeleteAccountSection extends Component {
  @service url;
  @tracked modalOpen = false;

  get supportHomeUrl() {
    return this.url.supportHomeUrl;
  }

  get hasEmail() {
    return Boolean(this.args.user.email);
  }

  @action
  openModal() {
    this.modalOpen = true;
  }

  @action
  closeModal() {
    this.modalOpen = false;
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

      <PixButton @triggerAction={{this.openModal}} @variant="error">
        {{t "pages.user-account.delete-account.actions.delete"}}
      </PixButton>

      <PixModal
        class="delete-account-modal"
        @title={{t "pages.user-account.delete-account.modal.title"}}
        @showModal={{this.modalOpen}}
        @onCloseButtonClick={{this.closeModal}}
      >
        <:content>
          <p>{{t "pages.user-account.delete-account.modal.question"}}</p>
          {{#if this.hasEmail}}
            <p>
              <strong>{{@user.email}}</strong>
            </p>
          {{else}}
            <p>
              <strong>
                {{@user.firstName}}
                {{@user.lastName}}
              </strong>
            </p>
          {{/if}}
          <p>{{t "pages.user-account.delete-account.modal.warning-1"}}</p>
          <p>{{t "pages.user-account.delete-account.modal.warning-2"}}</p>
        </:content>

        <:footer>
          <PixButton @variant="secondary" @isBorderVisible={{true}} @triggerAction={{this.closeModal}}>
            {{t "common.actions.cancel"}}
          </PixButton>
          <PixButton @variant="error">{{t "pages.user-account.delete-account.actions.delete"}}</PixButton>
        </:footer>
      </PixModal>
    </section>
  </template>
}
