import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import CopyButton from 'ember-cli-clipboard/components/copy-button';
import isClipboardSupported from 'ember-cli-clipboard/helpers/is-clipboard-supported';

export default class CopyPasteButton extends Component {
  @tracked tooltipText;

  constructor() {
    super(...arguments);
    this.tooltipText = this.args.defaultMessage;
  }

  @action
  onClipboardSuccess() {
    this.tooltipText = this.args.successMessage;
  }

  @action
  onClipboardOut() {
    this.tooltipText = this.args.defaultMessage;
  }

  <template>
    {{#if (isClipboardSupported)}}
      <PixTooltip @id="copy-paste-button" @position="bottom" @isInline={{true}}>
        <:triggerElement>
          <CopyButton
            @text={{@clipBoardtext}}
            @onSuccess={{this.onClipboardSuccess}}
            {{on "mouseLeave" this.onClipboardOut}}
            aria-label={{@defaultMessage}}
            aria-describedby="copy-paste-button"
            class="pix-icon-button pix-icon-button--small pix-icon-button--dark-grey"
            ...attributes
          >
            <PixIcon @name="copy" />
          </CopyButton>
        </:triggerElement>
        <:tooltip>
          {{this.tooltipText}}
        </:tooltip>
      </PixTooltip>
    {{/if}}
  </template>
}
