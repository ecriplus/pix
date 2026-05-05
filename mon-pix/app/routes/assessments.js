import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AssessmentsRoute extends Route {
  @service intl;
  @service store;

  async model(params) {
    return this.fetchAssessment(params.assessment_id, 1);
  }

  async fetchAssessment(id, retryCounter) {
    try {
      return await this.store.findRecord('assessment', id);
    } catch (error) {
      const isLocked = error.errors?.some((e) => e.status === '423');

      if (isLocked && retryCounter < 5) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.fetchAssessment(id, retryCounter + 1);
      }
      throw error;
    }
  }

  afterModel(model) {
    if (model.isCertification) {
      model.title = this.intl.t('pages.challenge.certification.title', { certificationNumber: model.title });
    }
    return model;
  }
}
