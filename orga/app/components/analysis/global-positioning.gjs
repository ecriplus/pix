import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixGauge from '@1024pix/pix-ui/components/pix-gauge';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class GlobalPositioning extends Component {
  @service intl;

  get stepLabels() {
    return [
      this.intl.t('pages.statistics.level.novice'),
      this.intl.t('pages.statistics.level.independent'),
      this.intl.t('pages.statistics.level.advanced'),
      this.intl.t('pages.statistics.level.expert'),
    ];
  }

  <template>
    <PixBlock class="global-positioning" @variant="orga">
      <h2 class="global-positioning__title">{{t "components.global-positioning.title"}}</h2>
      <p class="global-positioning__description">{{t "components.global-positioning.description"}}</p>
      <PixGauge
        @isSmall={{false}}
        @stepLabels={{this.stepLabels}}
        @maxLevel={{@data.maxReachableLevel}}
        @reachedLevel={{@data.meanReachedLevel}}
        @label={{t
          "components.global-positioning.gauge-label"
          reachedLevel=@data.meanReachedLevel
          maxLevel=@data.maxReachableLevel
        }}
      />
    </PixBlock>
  </template>
}
