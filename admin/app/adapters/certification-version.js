import ApplicationAdapter from './application';

export default class CertificationVersionAdapter extends ApplicationAdapter {
  namespace = 'api/admin';

  queryRecord(store, type, query) {
    const scope = query.scope || 'CORE';
    const url = `${this.host}/${this.namespace}/certification-versions/${scope}/active`;
    return this.ajax(url, 'GET');
  }

  updateRecord(store, type, snapshot) {
    const certificationVersionId = snapshot.id;
    const url = `${this.host}/${this.namespace}/certification-versions/${certificationVersionId}`;
    const data = this.serialize(snapshot, { includeId: true });
    return this.ajax(url, 'PATCH', { data });
  }
}
