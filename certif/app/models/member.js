import { service } from '@ember/service';
import Model, { attr } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';

export default class Member extends Model {
  @service intl;

  @attr('string') firstName;
  @attr('string') lastName;
  @attr('boolean') isReferer;
  @attr('string') role;
  @attr('number') certificationCenterMembershipId;

  certificationCenterMembersRole = {
    ADMIN: this.intl.t('pages.team.members.role.admin'),
    MEMBER: this.intl.t('pages.team.members.role.member'),
  };

  get roleLabel() {
    return this.certificationCenterMembersRole[this.role];
  }

  get isAdmin() {
    return this.role === 'ADMIN';
  }

  updateReferer = memberAction({
    type: 'post',
    urlType: 'update-referer',
    before({ userId, isReferer }) {
      return {
        data: {
          attributes: {
            userId,
            isReferer,
          },
        },
      };
    },
  });
}
