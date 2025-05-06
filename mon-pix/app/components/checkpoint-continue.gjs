import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import Component from '@glimmer/component';

export default class CheckpointContinue extends Component {
  <template>
    <div class="checkpoint__continue">
      <PixButtonLink
        @route="assessments.resume"
        @model={{@assessmentId}}
        @query={{this.query}}
        @variant="primary-bis"
        class="checkpoint__continue-button"
      >
        {{@nextPageButtonText}}
        <PixIcon @name="arrowRight" @ariaHidden={{true}} />
      </PixButtonLink>
    </div>
  </template>
  get query() {
    return {
      hasSeenCheckpoint: true,
    };
  }
}
