import ApplicationAdapter from './application';

export default class AttestationAdapter extends ApplicationAdapter {
  urlForFindAll(_, { adapterOptions }) {
    const { organizationId } = adapterOptions;
    return `${this.host}/${this.namespace}/organizations/${organizationId}/attestations`;
  }
}
