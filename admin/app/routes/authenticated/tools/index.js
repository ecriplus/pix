import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ToolsRoute extends Route {
  @service router;
  @service accessControl;

  beforeModel() {
    this.router.transitionTo('authenticated.tools.campaigns');
  }
}
