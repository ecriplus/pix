import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class Feedback extends Route {
  @service router;
  @service store;

  async model() {
    const assessment = await this.modelFor('assessment').reload();
    const mission = await this.store.findRecord('mission', assessment.missionId);
    return { mission, assessment };
  }
}
