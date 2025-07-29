import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class UserAccountPersonalInformationController extends Controller {
  @service currentUser;
  @service currentDomain;

  @tracked shouldDisplayLanguageUpdatedMessage = false;

  @action
  async onLanguageChange(language) {
    if (!this.currentDomain.isFranceDomain) {
      await this.currentUser.user.save({ adapterOptions: { lang: language } });
      this.shouldDisplayLanguageUpdatedMessage = true;
    }
  }
}
