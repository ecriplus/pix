import ApplicationAdapter from './application';

export default class CertificationCenterMembershipAdapter extends ApplicationAdapter {
  namespace = 'api/certification-centers';

  updateRecord(store, type, snapshot) {
    const { adapterOptions } = snapshot;

    if (adapterOptions && adapterOptions.updateLastAccessedAt) {
      const url = `${this.host}/${this.namespace}/${adapterOptions.certificationCenterId}/certification-center-memberships/me`;

      delete adapterOptions.updateLastAccessedAt;

      return this.ajax(url, 'PATCH');
    }

    return super.updateRecord(...arguments);
  }
}
