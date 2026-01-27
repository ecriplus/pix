import ApplicationAdapter from './application';

export default class CombinedCourseBlueprintAdapter extends ApplicationAdapter {
  namespace = 'api/admin';

  async detachOrganizations(combinedCourseBlueprintId, organizationId) {
    const url = `${this.host}/${this.namespace}/combined-course-blueprints/${combinedCourseBlueprintId}/organizations/${organizationId}`;
    await this.ajax(url, 'DELETE');
  }
  async attachOrganizations({ combinedCourseBlueprintId, organizationIds }) {
    const url = `${this.host}/${this.namespace}/combined-course-blueprints/${combinedCourseBlueprintId}/organizations`;
    const result = await this.ajax(url, 'POST', {
      data: { 'organization-ids': organizationIds },
    });
    return result;
  }
}
