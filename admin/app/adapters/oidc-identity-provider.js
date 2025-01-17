import ApplicationAdapter from './application';

const PIX_ADMIN_TARGET = 'admin';

export default class OidcIdentityProviderAdapter extends ApplicationAdapter {
  urlForFindAll(_, snapshot) {
    if (snapshot.adapterOptions?.readyIdentityProviders) {
      return `${this.host}/${this.namespace}/oidc/identity-providers?target=${PIX_ADMIN_TARGET}`;
    }
    return `${this.host}/${this.namespace}/admin/oidc/identity-providers`;
  }
}
