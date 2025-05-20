import ApplicationAdapter from './application';

export default class Module extends ApplicationAdapter {
  queryRecord(store, type, query) {
    if (query.slug) {
      const url = `${this.host}/${this.namespace}/modules/${query.slug}`;
      return this.ajax(url, 'GET');
    }

    return super.queryRecord(...arguments);
  }
}
