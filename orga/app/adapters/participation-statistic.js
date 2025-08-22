import ApplicationAdapter from './application';

export default class ParticipationStatisticsAdapter extends ApplicationAdapter {
  urlForQueryRecord(query) {
    const { organizationId } = query;
    delete query.organizationId;

    return `${this.host}/${this.namespace}/organizations/${organizationId}/participation-statistics`;
  }
}
