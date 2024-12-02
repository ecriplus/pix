import ApplicationAdapter from './application';

export default class UserOidcAuthenticationRequest extends ApplicationAdapter {
  buildURL() {
    return `${this.host}/${this.namespace}/oidc/user/`;
  }
}
