import ApplicationAdapter from './application';

export default class CombinedCourseBlueprintAdapter extends ApplicationAdapter {
  namespace = 'api/admin';

  async detachOrganizations(combinedCourseBlueprintId, organizationId) {
    const url = `${this.host}/${this.namespace}/combined-course-blueprints/${combinedCourseBlueprintId}/organizations/${organizationId}`;
    await this.ajax(url, 'DELETE');
  }
}
