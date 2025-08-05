import PixIndicatorCard from '@1024pix/pix-ui/components/pix-indicator-card';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import PageTitle from 'pix-orga/components/ui/page-title';

export default class IndexMissions extends Component {
  @service currentUser;

  <template>
    <PageTitle>
      <:title>
        {{t "pages.index.welcome-title" name=this.currentUser.prescriber.firstName}}
      </:title>
    </PageTitle>
    <p class="page-index__description">{{t "pages.index.missions.description"}}</p>
    <section>
      <h2 class="page-index-organization__title">{{t "pages.index.classic.organization-information.title"}}</h2>

      <PixIndicatorCard
        @title={{t "pages.index.classic.organization-information.label"}}
        @color="primary"
        @iconName="buildings"
      >
        <:default>
          {{this.currentUser.organization.name}}
        </:default>
      </PixIndicatorCard>
    </section>
  </template>
}
