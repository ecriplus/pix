import ApplicationAdapter from './application';

export default class AnonymisedCampaignAssessment extends ApplicationAdapter {
  urlForFindAll(modelName, { adapterOptions }) {
    return `${this.host}/${this.namespace}/users/${adapterOptions.userId}/anonymised-campaign-assessments`;
  }
}
