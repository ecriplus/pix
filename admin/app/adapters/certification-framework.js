import ApplicationAdapter from './application';

export default class CertificationFrameworkAdapter extends ApplicationAdapter {
  namespace = 'api/admin';

  urlForFindRecord(id) {
    return `${this.host}/${this.namespace}/certification-frameworks/${id}/target-profiles`;
  }
}
