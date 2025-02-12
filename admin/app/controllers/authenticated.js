import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class AuthenticatedController extends Controller {
  @service featureToggles;

  get shouldDisplayNewSidebar() {
    return this.featureToggles.featureToggles?.isPixAdminNewSidebarEnabled;
  }
}
