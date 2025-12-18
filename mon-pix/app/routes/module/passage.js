import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ModulePassageRoute extends Route {
  @service store;
  @service passageEvents;
  @service moduleIssueReport;

  async model() {
    const module = this.modelFor('module');
    const passage = await this.store.createRecord('passage', { moduleId: module.id }).save({
      adapterOptions: {
        occurredAt: new Date().getTime(),
        sequenceNumber: 1,
        moduleVersion: module.version,
      },
    });

    this.passageEvents.initialize({ passageId: passage.id });
    this.moduleIssueReport.initialize({ passageId: passage.id, moduleId: module.id });
    return { module, passage };
  }
}
