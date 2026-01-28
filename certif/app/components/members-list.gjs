import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import MembersTable from 'pix-certif/components/members-table';
import ChangeMemberRoleModal from 'pix-certif/components/team/modal/change-member-role-modal';
import LeaveCertificationCenter from 'pix-certif/components/team/modal/leave-certification-center';
import RemoveMemberModal from 'pix-certif/components/team/modal/remove-member-modal';

export default class MembersList extends Component {
  @service currentUser;
  @service intl;
  @service pixToast;
  @service session;

  @tracked isLeaveCertificationCenterModalOpen = false;
  @tracked isRemoveMemberModalOpen = false;
  @tracked isChangeMemberRoleModalOpen = false;
  @tracked removingMember;
  @tracked member;

  @action
  openLeaveCertificationCenterModal() {
    this.isLeaveCertificationCenterModalOpen = true;
  }

  @action
  openRemoveMemberModal(member) {
    this.removingMember = member;
    this.isRemoveMemberModalOpen = true;
  }

  @action
  openChangeMemberRoleModal(member) {
    this.member = member;
    this.isChangeMemberRoleModalOpen = true;
  }

  @action
  closeLeaveCertificationCenterModal() {
    this.isLeaveCertificationCenterModalOpen = false;
  }

  @action
  closeRemoveMemberModal() {
    this.isRemoveMemberModalOpen = false;
    this.removingMember = undefined;
  }

  @action
  closeChangeMemberRoleModal() {
    this.isChangeMemberRoleModalOpen = false;
  }

  @action
  async leaveCertificationCenter() {
    try {
      await this.args.onLeaveCertificationCenter();
      this.pixToast.sendSuccessNotification({
        message: this.intl.t('pages.team.members.notifications.leave-certification-center.success', {
          certificationCenterName: this.currentUser.currentAllowedCertificationCenterAccess.name,
        }),
      });
      await this.session.waitBeforeInvalidation(5000);
      this.session.invalidate();
    } catch {
      this.pixToast.sendErrorNotification({
        message: this.intl.t('pages.team.members.notifications.leave-certification-center.error'),
      });
    } finally {
      this.closeLeaveCertificationCenterModal();
    }
  }

  @action
  async removeMember() {
    try {
      await this.args.onRemoveMember(this.removingMember);
      this.pixToast.sendSuccessNotification({
        message: this.intl.t('pages.team.members.notifications.remove-membership.success', {
          memberFirstName: this.removingMember.firstName,
          memberLastName: this.removingMember.lastName,
        }),
      });
    } catch {
      this.pixToast.sendErrorNotification({
        message: this.intl.t('pages.team.members.notifications.remove-membership.error'),
      });
    } finally {
      this.closeRemoveMemberModal();
    }
  }

  @action
  async changeMemberRole(role) {
    try {
      this.member.role = role;
      await this.member.save();
      this.pixToast.sendSuccessNotification({
        message: this.intl.t('pages.team.members.notifications.change-member-role.success'),
      });
      this.isChangeMemberRoleModalOpen = false;
    } catch {
      this.member.rollbackAttributes();
      this.pixToast.sendErrorNotification({
        message: this.intl.t('pages.team.members.notifications.change-member-role.error'),
      });
      this.isChangeMemberRoleModalOpen = false;
    }
  }

  <template>
    <div role='tabpanel'>
      <MembersTable
        @members={{@members}}
        @hasCleaHabilitation={{@hasCleaHabilitation}}
        @onLeaveCertificationCenterButtonClicked={{this.openLeaveCertificationCenterModal}}
        @onRemoveMemberButtonClicked={{this.openRemoveMemberModal}}
        @onChangeMemberRoleButtonClicked={{this.openChangeMemberRoleModal}}
      />
    </div>

    <LeaveCertificationCenter
      @certificationCenterName={{this.currentUser.currentAllowedCertificationCenterAccess.name}}
      @isOpen={{this.isLeaveCertificationCenterModalOpen}}
      @onClose={{this.closeLeaveCertificationCenterModal}}
      @onSubmit={{this.leaveCertificationCenter}}
    />

    <RemoveMemberModal
      @firstName={{this.removingMember.firstName}}
      @lastName={{this.removingMember.lastName}}
      @isOpen={{this.isRemoveMemberModalOpen}}
      @onSubmit={{this.removeMember}}
      @onClose={{this.closeRemoveMemberModal}}
    />

    <ChangeMemberRoleModal
      @member={{this.member}}
      @isOpen={{this.isChangeMemberRoleModalOpen}}
      @onSubmit={{this.changeMemberRole}}
      @onClose={{this.closeChangeMemberRoleModal}}
    />
  </template>
}
