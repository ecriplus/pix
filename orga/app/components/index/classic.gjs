import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import ScoBanner from 'pix-orga/components/banner/sco-banner';
import ActionCardsList from 'pix-orga/components/index/action-cards-list';
import ActionCardsListItem from 'pix-orga/components/index/action-cards-list-item';
import OrganizationInfo from 'pix-orga/components/index/organization-information';
import ParticipationStatistics from 'pix-orga/components/index/participation-statistics';
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

    <ParticipationStatistics @participationStatistics={{@participationStatistics}} />

    <ActionCardsList>

      <ActionCardsListItem
        @title={{t "components.index.action-cards.classic.create-campaign.title"}}
        @description={{t "components.index.action-cards.classic.create-campaign.description"}}
      >
        <PixButtonLink @variant="secondary" type="button" @route="authenticated.campaigns.new">
          {{t "components.index.action-cards.classic.create-campaign.buttonText"}}
        </PixButtonLink>
      </ActionCardsListItem>

      <ActionCardsListItem
        @title={{t "components.index.action-cards.classic.follow-activity.title"}}
        @description={{t "components.index.action-cards.classic.follow-activity.description"}}
      >
        <PixButtonLink @variant="secondary" type="button" @route="authenticated.campaigns.list.my-campaigns">
          {{t "components.index.action-cards.classic.follow-activity.buttonText"}}
        </PixButtonLink>
      </ActionCardsListItem>

    </ActionCardsList>
  </template>
}
