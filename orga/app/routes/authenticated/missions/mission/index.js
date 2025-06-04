import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexMissionRoute extends Route {
  @service router;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  beforeModel() {
    return this.router.replaceWith('authenticated.missions.mission.activities');
  }
}
