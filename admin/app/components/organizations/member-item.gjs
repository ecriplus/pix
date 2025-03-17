import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import dayjs from 'dayjs';

import ActionsOnUsersRoleInOrganization from '../actions-on-users-role-in-organization';

export default class MemberItem extends Component {
  get lastAccessedAt() {
    if (!this.args.organizationMembership.lastAccessedAt) {
      return null;
    }
    return dayjs(this.args.organizationMembership.lastAccessedAt).format('DD/MM/YYYY HH:mm');
  }

  <template>
    <td><LinkTo @route="authenticated.users.get" @model={{@organizationMembership.user.id}}>
        {{@organizationMembership.user.id}}
      </LinkTo></td>
    <td>{{@organizationMembership.user.firstName}}</td>
    <td>{{@organizationMembership.user.lastName}}</td>
    <td>{{@organizationMembership.user.email}}</td>
    <td>{{this.lastAccessedAt}}</td>
    <ActionsOnUsersRoleInOrganization @organizationMembership={{@organizationMembership}} />
  </template>
}
