import { service } from '@ember/service';
import Component from '@glimmer/component';

export default class MembersList extends Component {
  @service currentUser;
  @service intl;

  get currentLocale() {
    return this.intl.primaryLocale;
  }

  get displayManagingColumn() {
    return this.currentUser.isAdminInOrganization;
  }

  get isMultipleAdminsAvailable() {
    return this.args.members?.filter((member) => member.isAdmin).length > 1;
  }
}
