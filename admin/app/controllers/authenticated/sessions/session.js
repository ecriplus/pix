import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SessionController extends Controller {
  @service router;

  @tracked inputId;

  @action
  onChangeInputId(event) {
    this.inputId = event.target.value;
  }

  @action
  loadSession(event) {
    event.preventDefault();
    const sessionId = this.inputId?.trim() ?? '';
    const routeName = this.router.currentRouteName;
    this.router.transitionTo(routeName, sessionId);
  }
}
