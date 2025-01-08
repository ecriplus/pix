import ApplicationAdapter from './application';

export default class ScoOrganizationParticipantAdapter extends ApplicationAdapter {
  urlForQuery(query) {
    const { organizationId } = query.filter;
    delete query.filter.organizationId;

    return `${this.host}/${this.namespace}/organizations/${organizationId}/sco-participants`;
  }

  async generateOrganizationLearnersUsernamePassword({ fileSaver, organizationId, organizationLearnersIds, token }) {
    const url = `${this.host}/${this.namespace}/sco-organization-learners/batch-username-password-generate`;
    const payload = JSON.stringify(
      {
        data: {
          attributes: { 'organization-id': organizationId, 'organization-learners-id': organizationLearnersIds },
        },
      },
      null,
      2,
    );
    const reqHeaders = new Headers();

    reqHeaders.set('Authorization', `Bearer ${token}`);
    reqHeaders.set('Content-Type', 'application/json');

    const request = fetch(url, {
      method: 'POST',
      headers: reqHeaders,
      body: payload,
    });

    return fileSaver.save({ fetcher: () => request });
  }
}
