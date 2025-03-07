import ApplicationAdapter from './application';

export default class CertificationCenterMembershipAdapter extends ApplicationAdapter {
  updateRecord(store, type, snapshot) {
    const { adapterOptions } = snapshot;

    if (adapterOptions && adapterOptions.updateLastAccessedAt) {
      const url = `${this.host}/api/certification-centers/${adapterOptions.certificationCenterId}/certification-center-memberships/me`;

      delete adapterOptions.updateLastAccessedAt;

      return this.ajax(url, 'PATCH');
    }

    return super.updateRecord(...arguments);
  }
}
