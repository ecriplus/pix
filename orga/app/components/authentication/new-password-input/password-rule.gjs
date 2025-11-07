import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import Component from '@glimmer/component';

const RULE_STYLES = {
  VALID: {
    iconClass: 'checkCircle',
    listItemClass: 'password-rule',
  },
  INVALID: {
    iconClass: 'cancel',
    listItemClass: 'password-rule password-rule--error',
  },
};

export default class PasswordRule extends Component {
  get classes() {
    return this.args.isValid ? RULE_STYLES.VALID : RULE_STYLES.INVALID;
  }

  <template>
    <li class="{{this.classes.listItemClass}}" aria-label="{{@description}}.">
      <PixIcon @name={{this.classes.iconClass}} @plainIcon={{true}} @ariaHidden={{true}} />
      <p aria-live="polite"> {{@description}} </p>
    </li>
  </template>
}
