import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class UserCertificationsRoute extends Route {
  @service store;

  model() {
    return this.store.findAll('certificate-summary');
  }

  @action
  loading() {
    return false;
  }
}
