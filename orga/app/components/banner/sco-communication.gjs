import { service } from '@ember/service';
import Component from '@glimmer/component';
import ScoBanner from 'pix-orga/components/banner/sco-banner';

export default class ScommunicationBanner extends Component {
  @service currentUser;
  @service router;

  get shouldDisplayBanner() {
    return (
      [
        'authenticated.campaigns.list.my-campaigns',
        'authenticated.campaigns.list.all-campaigns',
        'authenticated.team.list.members',
        'authenticated.sco-organization-participants.list',
      ].includes(this.router.currentRouteName) && this.currentUser.isSCOManagingStudents
    );
  }
  get importParticipantUrl() {
    return this.router.urlFor('authenticated.import-organization-participants');
  }

  <template>
    {{#if this.shouldDisplayBanner}}
      <ScoBanner />
    {{/if}}
  </template>
}
