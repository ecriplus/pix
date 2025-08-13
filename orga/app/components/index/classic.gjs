import { service } from '@ember/service';
import Component from '@glimmer/component';
import ScoBanner from 'pix-orga/components/banner/sco-banner';
import OrganizationInfo from 'pix-orga/components/index/organization-information';
import Welcome from 'pix-orga/components/index/welcome';

export default class IndexClassic extends Component {
  @service currentUser;
  @service intl;

  get description() {
    return this.intl.t('components.index.welcome.description.classic');
  }

  <template>
    <Welcome @firstName={{this.currentUser.prescriber.firstName}} @description={{this.description}} />
    {{#if this.currentUser.isSCOManagingStudents}}
      <ScoBanner />
    {{/if}}
    <OrganizationInfo @organizationName={{this.currentUser.organization.name}} />
  </template>
}
