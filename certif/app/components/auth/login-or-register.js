import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class LoginOrRegister extends Component {
  @service currentDomain;
  @service locale;
  @service router;

  @tracked displayRegisterForm = true;
  @tracked selectedLanguage = this.locale.currentLocale;

  get isInternationalDomain() {
    return !this.currentDomain.isFranceDomain;
  }

  @action
  onLanguageChange(value) {
    this.selectedLanguage = value;
    this.locale.setCurrentLocale(this.selectedLanguage);
    this.router.replaceWith('join', {
      queryParams: {
        lang: null,
      },
    });
  }

  @action
  toggleFormsVisibility() {
    this.displayRegisterForm = !this.displayRegisterForm;
  }
}
