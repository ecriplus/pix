import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

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
}
