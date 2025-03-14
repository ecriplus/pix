import ApplicationAdapter from './application';

export default class CertificationCenterMembershipAdapter extends ApplicationAdapter {
  updateRecord(store, type, snapshot) {
    const { adapterOptions } = snapshot;

    if (adapterOptions && adapterOptions.updateLastAccessedAt) {
      const url = `${this.host}/api/certification-center-memberships/${snapshot.id}/access`;

      delete adapterOptions.updateLastAccessedAt;

      return this.ajax(url, 'POST');
    }

    return super.updateRecord(...arguments);
  }
}
