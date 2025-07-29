import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class LoginController extends Controller {
  @service locale;
  @service dayjs;
  @service currentDomain;
  @service router;

  @tracked selectedLanguage = this.locale.currentLocale;

  get isInternationalDomain() {
    return !this.currentDomain.isFranceDomain;
  }

  @action
  onLanguageChange(value) {
    this.selectedLanguage = value;
    this.locale.setCurrentLocale(this.selectedLanguage);
    this.router.replaceWith('login', { queryParams: { lang: null } });
  }
}
