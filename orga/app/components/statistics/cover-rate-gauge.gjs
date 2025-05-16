import { guidFor } from '@ember/object/internals';
import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

const MAX_REACHABLE_LEVEL = 7;

export default class CoverRateGauge extends Component {
  get id() {
    return guidFor(this);
  }

  get userLevel() {
    return this.formatNumber(this.args.userLevel);
  }

  get tubeLevel() {
    return this.formatNumber(this.args.tubeLevel);
  }

  get translation() {
    return this.args.label || 'pages.statistics.gauge.label';
  }

  formatNumber = (str) => {
    const num = Number(str);
    const oneDigitNum = num.toFixed(1);
    if (oneDigitNum.toString().endsWith('0')) {
      return Math.ceil(num);
    }
    return oneDigitNum;
  };

  getGaugeSizeStyle = (level, { withExtraPercentage }) => {
    const gaugeSize = (level / MAX_REACHABLE_LEVEL) * 100;
    return htmlSafe(`width: calc(${gaugeSize}% + ${withExtraPercentage ? 5 : 0}%)`);
  };

  <template>
    <div class="cover-rate-gauge">
      <div class="cover-rate-gauge__container">
        <div
          aria-hidden="true"
          class="cover-rate-gauge__level cover-rate-gauge__level--tube-level"
          style={{this.getGaugeSizeStyle this.tubeLevel withExtraPercentage=true}}
        >
          {{this.tubeLevel}}
        </div>
        <div class="cover-rate-gauge__background {{if @hideMaxMin ' cover-rate-gauge__background--hide-max-min'}}">
          <label for={{this.id}} class="screen-reader-only">{{t
              this.translation
              userLevel=this.userLevel
              tubeLevel=this.tubeLevel
            }}</label>
          <progress
            aria-hidden="true"
            class="cover-rate-gauge__progress"
            id={{this.id}}
            max={{this.tubeLevel}}
            value={{this.userLevel}}
            style={{this.getGaugeSizeStyle this.tubeLevel withExtraPercentage=false}}
          >
            {{this.userLevel}}
          </progress>
        </div>
        <div
          aria-hidden="true"
          class="cover-rate-gauge__level cover-rate-gauge__level--user-level"
          style={{this.getGaugeSizeStyle this.userLevel withExtraPercentage=true}}
        >
          {{this.userLevel}}
        </div>
      </div>
    </div>
  </template>
}
