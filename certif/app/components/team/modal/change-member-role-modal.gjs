import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { or } from 'ember-truth-helpers';

const ARIA_LABEL_MEMBER_TRANSLATION = 'pages.team.members.modals.change-member-role.select-role.options.member';
const ARIA_LABEL_ADMIN_TRANSLATION = 'pages.team.members.modals.change-member-role.select-role.options.admin';

export default class ChangeMemberRoleModal extends Component {
  @service intl;
  @tracked role = null;

  roleOptions = [
    {
      value: 'ADMIN',
      label: this.intl.t(ARIA_LABEL_ADMIN_TRANSLATION),
      disabled: false,
    },
    {
      value: 'MEMBER',
      label: this.intl.t(ARIA_LABEL_MEMBER_TRANSLATION),
      disabled: false,
    },
  ];

  displayRoleByOrganizationRole = {
    ADMIN: this.intl.t(ARIA_LABEL_ADMIN_TRANSLATION),
    MEMBER: this.intl.t(ARIA_LABEL_MEMBER_TRANSLATION),
  };

  @action
  setRoleSelection(value) {
    this.role = value;
  }

  @action
  closeModal() {
    this.role = null;
    this.args.onClose();
  }

  <template>
    <PixModal
      @title={{t 'pages.team.members.modals.change-member-role.title'}}
      @showModal={{@isOpen}}
      @onCloseButtonClick={{this.closeModal}}
    >
      <:content>
        <p>
          {{t
            'pages.team.members.modals.change-member-role.information'
            firstName=@member.firstName
            lastName=@member.lastName
          }}
        </p>

        <PixSelect
          @hideDefaultOption={{true}}
          @onChange={{this.setRoleSelection}}
          @options={{this.roleOptions}}
          @value={{or this.role @member.role}}
          class='change-member-role-modal__select-role'
        >
          <:label>{{t 'pages.team.members.modals.change-member-role.select-role.label'}}</:label>
        </PixSelect>
      </:content>
      <:footer>
        <PixButton @triggerAction={{this.closeModal}} @variant='secondary' @isBorderVisible={{true}}>
          {{t 'common.actions.cancel'}}
        </PixButton>
        <PixButton
          id='save-certification-center-role'
          @triggerAction={{fn @onSubmit this.role}}
          @size='small'
          aria-label={{t 'pages.team.members.actions.save'}}
        >
          {{t 'pages.team.members.actions.save'}}
        </PixButton>
      </:footer>
    </PixModal>
  </template>
}
