import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

const LOGIN_ROUTE_NAME = 'authentication';

export default class SsoSelectionController extends Controller {
  @service router;

  @action
  goBack() {
    this.router.transitionTo(this.parentRouteName);
  }

  get parentRouteName() {
    return this.router.currentRoute?.parent?.name ?? LOGIN_ROUTE_NAME;
  }

  get isLoginRoute() {
    return this.parentRouteName === LOGIN_ROUTE_NAME;
  }
}
