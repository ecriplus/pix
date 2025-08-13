import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class IndexController extends Controller {
  @service currentUser;

  get canAccessMissionsPage() {
    return this.currentUser.canAccessMissionsPage;
  }
}
