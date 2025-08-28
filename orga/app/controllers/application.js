import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service router;

  get isAuthenticatedRoute() {
    return this.router.currentRouteName.startsWith('authenticated.');
  }
}
