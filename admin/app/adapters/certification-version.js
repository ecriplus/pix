import ApplicationAdapter from './application';

export default class CertificationVersionAdapter extends ApplicationAdapter {
  namespace = 'api/admin';

  updateRecord(store, type, snapshot) {
    const certificationVersionId = snapshot.id;
    const url = `${this.host}/${this.namespace}/certification-versions/${certificationVersionId}`;
    const data = this.serialize(snapshot, { includeId: true });
    return this.ajax(url, 'PATCH', { data });
  }
}
