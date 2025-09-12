import ApplicationAdapter from './application';

export default class FrameworkHistoryAdapter extends ApplicationAdapter {
  namespace = 'api/admin';

  queryRecord(store, type, complementaryCertificationKey) {
    const url = `${this.host}/${this.namespace}/complementary-certifications/${complementaryCertificationKey}/framework-history`;
    return this.ajax(url, 'GET');
  }
}
