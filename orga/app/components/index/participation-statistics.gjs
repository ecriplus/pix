import PixIndicatorCard from '@1024pix/pix-ui/components/pix-indicator-card';
import { service } from '@ember/service';
import Component from '@glimmer/component';

export default class ParticipationStatistics extends Component {
  @service intl;

  get completionRateTitle() {
    return this.intl.t('components.index.participation-statistics.completion-rate.title');
  }

  get completionRateInfo() {
    return this.intl.t('components.index.participation-statistics.completion-rate.info');
  }

  get completionRateDescription() {
    const completed = 12;
    const started = 20;
    return this.intl.t('components.index.participation-statistics.completion-rate.description', {
      completed,
      started,
    });
  }

  get completedParticipationsTitle() {
    return this.intl.t('components.index.participation-statistics.completed-participations.title');
  }

  get completedParticipationsInfo() {
    return this.intl.t('components.index.participation-statistics.completed-participations.info');
  }

  get completedParticipationsDescription() {
    return this.intl.t('components.index.participation-statistics.completed-participations.description');
  }

  <template>
    <section class="participation-statistics">

      <PixIndicatorCard
        @title={{this.completionRateTitle}}
        @color="success"
        @iconName="speed"
        @info={{this.completionRateInfo}}
        @infoLabel={{this.infoLabel}}
        @isLoading={{this.isLoading}}
        @loadingMessage={{this.loadingMessage}}
      >
        <:default>78%</:default>
        <:sub>
          {{this.completionRateDescription}}
        </:sub>
      </PixIndicatorCard>

      <PixIndicatorCard
        @title={{this.completedParticipationsTitle}}
        @color="tertiary"
        @iconName="inboxIn"
        @info={{this.completedParticipationsInfo}}
        @infoLabel={{this.infoLabel}}
        @isLoading={{this.isLoading}}
        @loadingMessage={{this.loadingMessage}}
      >
        <:default>78</:default>
        <:sub>
          {{this.completedParticipationsDescription}}
        </:sub>
      </PixIndicatorCard>

    </section>
  </template>
}
