import { service } from '@ember/service';
import Component from '@glimmer/component';
import OrganizationInfo from 'pix-orga/components/index/organization-information';
import Welcome from 'pix-orga/components/index/welcome';

export default class IndexMissions extends Component {
  @service currentUser;
  @service intl;

  get description() {
    return this.intl.t('components.index.welcome.description.missions');
  }

  <template>
    <Welcome @firstName={{this.currentUser.prescriber.firstName}} @description={{this.description}} />
    <OrganizationInfo @organizationName={{this.currentUser.organization.name}} />
  </template>
}
