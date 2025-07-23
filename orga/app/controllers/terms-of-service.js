import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const DUTCH_LOCALE = 'nl';
const ENGLISH_LOCALE = 'en';

export default class TermOfServiceController extends Controller {
  @service currentUser;
  @service locale;
  @service router;

  @tracked isDutchLocale = this.locale.currentLocale === DUTCH_LOCALE;
  @tracked isEnglishLocale = this.locale.currentLocale === ENGLISH_LOCALE;

  @action
  async submit() {
    await this.currentUser.prescriber.save({ adapterOptions: { acceptPixOrgaTermsOfService: true } });
    this.currentUser.prescriber.pixOrgaTermsOfServiceStatus = 'accepted';
    this.router.transitionTo('application');
  }
}
