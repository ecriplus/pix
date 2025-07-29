import { service } from '@ember/service';
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from 'pix-orga/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service ajaxQueue;
  @service locale;
  @service session;

  host = ENV.APP.API_HOST;
  namespace = 'api';

  get headers() {
    const headers = {};
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }
    headers['Accept-Language'] = this.locale.acceptLanguageHeader;
    headers['X-App-Version'] = ENV.APP.APP_VERSION;
    return headers;
  }

  ajax() {
    return this.ajaxQueue.add(() => super.ajax(...arguments));
  }

  handleResponse(status, headers, errors) {
    if (errors?.errors?.[0]?.id) {
      console.table(errors.errors[0]);
    }

    return super.handleResponse(...arguments);
  }
}
