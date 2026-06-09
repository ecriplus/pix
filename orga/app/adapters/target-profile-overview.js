import ApplicationAdapter from './application';

export default class TargetProfileOverviewAdapter extends ApplicationAdapter {
  urlForFindRecord(id, modelName, snapshot) {
    const { organizationId } = snapshot.adapterOptions;
    return `${this.host}/${this.namespace}/organizations/${organizationId}/target-profiles/${id}`;
  }
}
