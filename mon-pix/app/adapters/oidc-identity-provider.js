import { service } from '@ember/service';

import ApplicationAdapter from './application';

export default class OidcIdentityProviderAdapter extends ApplicationAdapter {
  @service currentDomain;

  urlForFindAll() {
    return `${this.host}/${this.namespace}/oidc/identity-providers/${this.currentDomain.getExtension()}`;
  }
}
