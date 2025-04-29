import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import isInteger from 'lodash/isInteger';

export default class TimedChallengeInstructions extends Component {
  <template>
    <div class="rounded-panel rounded-panel--no-margin-bottom timed-challenge-instructions">
      <h1 class="timed-challenge-instructions__primary">
        {{t "pages.timed-challenge-instructions.primary" time=this.allocatedTime htmlSafe=true}}
      </h1>

      <p class="timed-challenge-instructions__secondary">
        {{t "pages.timed-challenge-instructions.secondary"}}
      </p>

      <div class="timed-challenge-instructions__allocated-time">
        <PixIcon @name="time" @ariaHidden={{true}} class="timed-challenge-instructions-allocated-time__icon" />
        <span>{{this.allocatedTime}}</span>
      </div>

      <PixButton
        @triggerAction={{@hasUserConfirmedWarning}}
        class="timed-challenge-instructions-action__confirmation-button"
        @variant="success"
      >
        {{t "pages.timed-challenge-instructions.action"}}
      </PixButton>
    </div>
  </template>
  @service intl;

  get allocatedTime() {
    if (!isInteger(this.args.time)) {
      return '';
    }

    const minutes = _getMinutes(this.args.time);
    const seconds = _getSeconds(this.args.time);

    let allocatedTime = this.intl.t('pages.timed-challenge-instructions.time.minutes', { minutes });
    if (minutes && seconds) allocatedTime += this.intl.t('pages.timed-challenge-instructions.time.and');
    allocatedTime += this.intl.t('pages.timed-challenge-instructions.time.seconds', { seconds });
    return allocatedTime;
  }
}

function _getMinutes(time) {
  return Math.floor(time / 60);
}

function _getSeconds(time) {
  return time % 60;
}
