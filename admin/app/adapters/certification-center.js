import ApplicationAdapter from './application';

export default class CertificationCenterAdapter extends ApplicationAdapter {
  namespace = 'api/admin';

  findHasMany(store, snapshot, _url, relationship) {
    if (relationship.key === 'certificationCenterMemberships') {
      return this.ajax(
        `${this.host}/${this.namespace}/certification-centers/${snapshot.id}/certification-center-memberships`,
        'GET',
      );
    }
    return super.findHasMany(...arguments);
  }

  archiveCertificationCenter(certificationCenterId) {
    return this.ajax(`${this.host}/${this.namespace}/certification-centers/${certificationCenterId}/archive`, 'POST');
  }
}
