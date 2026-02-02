import { service } from '@ember/service';
import Component from '@glimmer/component';
import ScoBanner from 'pix-orga/components/banner/sco-banner';
import ScoIABanner from 'pix-orga/components/banner/sco-ia-banner';

export default class ScommunicationBanner extends Component {
  @service currentUser;
  @service router;
  @service featureToggles;

  get shouldDisplayBanner() {
    const isValidRoute =
      this.args.forceDisplayBanner ||
      [
        'authenticated.campaigns.list.my-campaigns',
        'authenticated.campaigns.list.all-campaigns',
        'authenticated.team.list.members',
        'authenticated.sco-organization-participants.list',
      ].includes(this.router.currentRouteName);
    return isValidRoute && this.currentUser.isSCOManagingStudents;
  }
  get importParticipantUrl() {
    return this.router.urlFor('authenticated.import-organization-participants');
  }

  get displayIaBanner() {
    return this.featureToggles.featureToggles?.displayIaCampaignBanner ?? false;
  }

  <template>
    {{#if this.shouldDisplayBanner}}
      {{#if this.displayIaBanner}}
        <ScoIABanner />
      {{else}}
        <ScoBanner />
      {{/if}}
    {{/if}}
  </template>
}
