import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { service } from '@ember/service';
import Component from '@glimmer/component';

export default class ModulixGrainTag extends Component {
  @service intl;

  get typeText() {
    return this.intl.t(`pages.modulix.grain.tag.${this.args.type}`);
  }

  get iconName() {
    switch (this.args.type) {
      case 'lesson':
        return 'book';
      case 'activity':
        return 'cogsMagic';
      case 'discovery':
        return 'doorOpen';
      case 'challenge':
        return 'think';
      case 'summary':
        return 'mountain';
      default:
        return 'book';
    }
  }

  <template>
    <div class="tag tag--{{@type}}">
      <PixIcon @name={{this.iconName}} @ariaHidden={{true}} />
      <span>{{this.typeText}}</span>
    </div>
  </template>
}
