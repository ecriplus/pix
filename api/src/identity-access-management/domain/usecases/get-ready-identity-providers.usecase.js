/**
 * @typedef {function} getReadyIdentityProviders
 * @param {Object} params
 * @param {string} [params.audience=app]
 * @param {OidcAuthenticationServiceRegistry} params.oidcAuthenticationServiceRegistry
 * @return {Promise<OidcAuthenticationService[]|null>}
 */
const getReadyIdentityProviders = async function ({ target = 'app', oidcAuthenticationServiceRegistry }) {
  await oidcAuthenticationServiceRegistry.loadOidcProviderServices();

  if (target === 'admin') {
    return oidcAuthenticationServiceRegistry.getReadyOidcProviderServicesForPixAdmin();
  }

  return oidcAuthenticationServiceRegistry.getReadyOidcProviderServices();
};

export { getReadyIdentityProviders };
