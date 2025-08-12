import { service } from '@ember/service';
import Component from '@glimmer/component';
import MissionBanner from 'pix-orga/components/banner/mission-banner';
import OrganizationInfo from 'pix-orga/components/index/organization-information';
import Welcome from 'pix-orga/components/index/welcome';

export default class IndexMissions extends Component {
  @service currentUser;
  @service intl;
  @service url;

  get description() {
    return this.intl.t('components.index.welcome.description.missions');
  }

  <template>
    <Welcome @firstName={{this.currentUser.prescriber.firstName}} @description={{this.description}} />
    <MissionBanner
      @isAdmin={{this.currentUser.isAdminInOrganization}}
      @pixJuniorSchoolUrl={{this.url.pixJuniorSchoolUrl}}
      @pixJuniorUrl={{this.url.pixJuniorUrl}}
      @schoolCode={{this.currentUser.organization.schoolCode}}
    />
    <OrganizationInfo @organizationName={{this.currentUser.organization.name}} />
  </template>
}
