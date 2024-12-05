import ApplicationAdapter from './application';

export default class AnalysisByTubeAdapter extends ApplicationAdapter {
  urlForQueryRecord(query) {
    const { organizationId } = query;
    delete query.organizationId;

    return `${this.host}/${this.namespace}/organizations/${organizationId}/organization-learners-level-by-tubes`;
  }
}
