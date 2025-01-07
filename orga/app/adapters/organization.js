import ApplicationAdapter from './application';

export default class OrganizationImportDetailAdapter extends ApplicationAdapter {
  async activateSession({ organizationId, token }) {
    const reqHeaders = new Headers();

    reqHeaders.set('Authorization', `Bearer ${token}`);
    reqHeaders.set('Content-Type', 'application/json');

    const url = `${this.host}/${this.namespace}/pix1d/schools/${organizationId}/session/activate`;
    return fetch(url, {
      method: 'POST',
      headers: reqHeaders,
    });
  }
}
