import ApplicationAdapter from './application';

export default class PlacesStatisticsAdapter extends ApplicationAdapter {
  urlForQueryRecord(query) {
    const { organizationId } = query;
    delete query.organizationId;

    return `${this.host}/${this.namespace}/admin/organizations/${organizationId}/places-statistics`;
  }
}
