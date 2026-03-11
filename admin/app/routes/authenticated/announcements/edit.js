import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AnnouncementsEditRoute extends Route {
  @service accessControl;
  @service store;

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin'], 'authenticated');
  }

  model() {
    return this.store.findRecord('announcement', 'SCO');
  }
}
