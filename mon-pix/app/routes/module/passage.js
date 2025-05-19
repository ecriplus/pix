import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ModulePassageRoute extends Route {
  @service store;
  @service passageEvents;

  async model() {
    const module = this.modelFor('module');
    const passage = await this.store.createRecord('passage', { moduleId: module.slug }).save({
      adapterOptions: {
        occurredAt: new Date().getTime(),
        sequenceNumber: 1,
        moduleVersion: module.version,
      },
    });

    this.passageEvents.initialize({ passageId: passage.id });

    return { module, passage };
  }
}
