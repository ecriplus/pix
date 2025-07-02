import ApplicationAdapter from './application';

export default class AttestationParticipantStatusAdapter extends ApplicationAdapter {
  urlForQuery(query) {
    const { attestationKey, organizationId } = query;
    delete query.attestationKey;
    delete query.organizationId;
    return `${this.host}/${this.namespace}/organizations/${organizationId}/attestations/${attestationKey}/statuses`;
  }
}
