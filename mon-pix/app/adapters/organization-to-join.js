import ApplicationAdapter from './application';

export default class OrganizationToJoin extends ApplicationAdapter {
  buildURL() {
    return `${this.host}/${this.namespace}/organizations-to-join`;
  }
  urlForQueryRecord(query) {
    if (query.code) {
      const url = `${this.buildURL()}/${query.code}`;
      delete query.code;
      return url;
    }

    return super.urlForQueryRecord(...arguments);
  }
  queryRecord(_, type, query) {
    return this.ajax(this.urlForQueryRecord(query, type), 'GET');
  }
}
