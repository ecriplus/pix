import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ModulePassageRoute extends Route {
  @service store;
  @service passageEvents;
  @service moduleIssueReport;
  @service modulixNavigationProgress;
  @service router;

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

  afterModel({ module }, transition) {
    const grainIndex = transition.to?.queryParams?.grainIndex;

    if (grainIndex) {
      this.modulixNavigationProgress.computeCurrentSectionByGrainIndex(module, Number(grainIndex));
    }
  }

  redirect({ module }) {
    this.router.replaceWith('module.passage', module.shortId, module.slug);
  }
}
