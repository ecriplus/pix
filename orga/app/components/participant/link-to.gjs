import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';

export default class extends Component {
  @service currentUser;

  get route() {
    if (this.currentUser.isSCOManagingStudents) {
      return 'authenticated.sco-organization-participants.sco-organization-participant';
    } else if (this.currentUser.isSUPManagingStudents) {
      return 'authenticated.sup-organization-participants.sup-organization-participant';
    }
    return 'authenticated.organization-participants.organization-participant';
  }

  <template>
    <LinkTo class="link" @route={{this.route}} @model={{@organizationLearnerId}} ...attributes>{{yield}}</LinkTo>
  </template>
}
