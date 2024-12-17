import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Item extends Component {
  @tracked isRebootable = false;

  constructor() {
    super(...arguments);
    window.addEventListener('message', ({ data }) => {
      if (data?.from === 'pix' && data?.type === 'init') {
        this.isRebootable = !!data.rebootable;
      }
    });
  }

  get isMediaWithForm() {
    const challenge = this.args.challenge;
    return challenge.hasForm && this.hasMedia && challenge.hasType;
  }

  get hasMedia() {
    return (
      this.args.challenge.illustrationUrl ||
      this.args.challenge.hasValidEmbedDocument ||
      this.args.challenge.hasWebComponent
    );
  }

  get shouldDisplayRebootButton() {
    return this.isRebootable && !this.args.isDisabled;
  }
}
