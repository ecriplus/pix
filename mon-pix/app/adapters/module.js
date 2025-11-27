import ApplicationAdapter from './application';

export default class Module extends ApplicationAdapter {
  queryRecord(store, type, query) {
    if (query.shortId || query.slug) {
      let url = '';
      if (query.shortId) {
        url = `${this.host}/${this.namespace}/modules/v2/${query.shortId}`;
      } else if (query.slug) {
        url = `${this.host}/${this.namespace}/modules/${query.slug}`;
      }

      if (query.encryptedRedirectionUrl) {
        const encryptedRedirectionUrl = encodeURIComponent(query.encryptedRedirectionUrl);
        url += `?encryptedRedirectionUrl=${encryptedRedirectionUrl}`;
      }

      return this.ajax(url, 'GET');
    }

    return super.queryRecord(...arguments);
  }
}
