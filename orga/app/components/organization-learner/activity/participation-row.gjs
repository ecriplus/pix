import { array } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import CampaignType from '../../campaign/detail/type';
import Date from '../../ui/date';
import ParticipationStatus from '../../ui/participation-status';

export default class ParticipationRow extends Component {
  @service router;

  get routeName() {
    return this.args.participation.campaignType === 'ASSESSMENT'
      ? 'authenticated.campaigns.participant-assessment'
      : 'authenticated.campaigns.participant-profile';
  }

  @action
  goToParticipationDetail(event) {
    event.preventDefault();
    this.router.transitionTo(
      this.routeName,
      this.args.participation.campaignId,
      this.args.participation.lastCampaignParticipationId,
    );
  }

  <template>
    <tr
      aria-label={{t "pages.organization-learner.activity.participation-list.table.row-title"}}
      {{on "click" this.goToParticipationDetail}}
      class="tr--clickable"
    >
      <td class="ellipsis">
        <LinkTo @route={{this.routeName}} @models={{array @participation.campaignId @participation.id}}>
          {{@participation.campaignName}}
        </LinkTo>
      </td>
      <td class="ellipsis">
        <CampaignType @campaignType={{@participation.campaignType}} @displayInformationLabel={{true}} />
      </td>
      <td class="table__column--left">
        <Date @date={{@participation.createdAt}} />
      </td>
      <td class="table__column--left">
        <Date @date={{@participation.sharedAt}} />
      </td>
      <td class="table__column--left">
        <ParticipationStatus @status={{@participation.status}} @campaignType={{@participation.campaignType}} />
      </td>
      <td class="table__column--left">
        {{@participation.participationCount}}
      </td>
    </tr>
  </template>
}
