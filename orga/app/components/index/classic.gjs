import PixIndicatorCard from '@1024pix/pix-ui/components/pix-indicator-card';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import Welcome from 'pix-orga/components/index/welcome';

export default class IndexClassic extends Component {
  @service currentUser;
  @service intl;

  get description() {
    return this.intl.t('components.index.welcome.description.classic');
  }

  <template>
    <Welcome @firstName={{this.currentUser.prescriber.firstName}} @description={{this.description}} />
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
