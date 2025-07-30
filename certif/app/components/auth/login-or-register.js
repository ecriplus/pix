import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class LoginOrRegister extends Component {
  @service currentDomain;

  @tracked displayRegisterForm = true;

  get isInternationalDomain() {
    return !this.currentDomain.isFranceDomain;
  }

  @action
  toggleFormsVisibility() {
    this.displayRegisterForm = !this.displayRegisterForm;
  }
}
