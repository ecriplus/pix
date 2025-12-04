import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import Component from '@glimmer/component';

export default class HabilitationTag extends Component {
  get className() {
    return `certification-center-information-display__habilitations-list--${this.args.active ? 'enabled' : 'disabled'}`;
  }

  get icon() {
    const { active } = this.args;

    return `${active ? 'checkCircle' : 'cancel'}`;
  }

  <template>
    <li aria-label={{@arialabel}} class={{this.className}}>
      <PixIcon @name={{this.icon}} />
      {{@label}}
    </li>
  </template>
}
