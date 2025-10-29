import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

export default class ActionsOnChildrenInOrganization extends Component {
  @service store;
  @service pixToast;
  @service intl;

  @tracked displayConfirmModal = false;

  @action
  toggleDisplayConfirmModal() {
    this.displayConfirmModal = !this.displayConfirmModal;
  }

  @action
  async handleDetachChildOrganization() {
    this.displayConfirmModal = false;
    await this._detachChildOrganizationFromParent({ childOrganizationId: this.args.childOrganization.id });
  }

  async _detachChildOrganizationFromParent({ childOrganizationId }) {
    const organizationAdapter = this.store.adapterFor('organization');

    try {
      await organizationAdapter.detachChildOrganizationFromParent({ childOrganizationId });

      this.pixToast.sendSuccessNotification({
        message: this.intl.t('pages.organization-children.notifications.success.detach-child-organization'),
      });

      await this.args.onRefreshOrganizationChildren();
    } catch (responseError) {
      const errors = responseError.errors;

      const errorMessageKey =
        errors && errors[0]?.code === 'UNABLE_TO_DETACH_PARENT_ORGANIZATION_FROM_CHILD_ORGANIZATION'
          ? 'pages.organization-children.notifications.error.unable-to-detach-child-organization'
          : 'common.notifications.generic-error';

      this.pixToast.sendErrorNotification({
        message: this.intl.t(errorMessageKey),
      });
    }
  }

  <template>
    <PixButton @size="small" @variant="error" @triggerAction={{this.toggleDisplayConfirmModal}}>
      {{t "components.organizations.children-list.actions.detach.button"}}
    </PixButton>

    <PixModal
      @title={{t "components.organizations.children-list.actions.detach.confirm-modal-title"}}
      @onCloseButtonClick={{this.toggleDisplayConfirmModal}}
      @showModal={{this.displayConfirmModal}}
    >
      <:content>
        <p>
          {{t
            "components.organizations.children-list.actions.detach.confirm-modal-message"
            organizationId=@childOrganization.id
          }}
        </p>
      </:content>
      <:footer>
        <PixButton @variant="secondary" @triggerAction={{this.toggleDisplayConfirmModal}}>
          {{t "common.actions.cancel"}}
        </PixButton>
        <PixButton @triggerAction={{this.handleDetachChildOrganization}}>{{t "common.actions.confirm"}}</PixButton>
      </:footer>
    </PixModal>
  </template>
}
