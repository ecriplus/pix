import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TermOfServiceController extends Controller {
  @service currentUser;
  @service router;

  @action
  async submit() {
    await this.currentUser.prescriber.save({ adapterOptions: { acceptPixOrgaTermsOfService: true } });
    this.currentUser.prescriber.pixOrgaTermsOfServiceStatus = 'accepted';
    this.router.transitionTo('application');
  }
}
