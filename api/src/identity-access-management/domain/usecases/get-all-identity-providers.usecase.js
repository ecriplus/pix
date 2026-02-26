/**
 * @typedef {function} getAllIdentityProviders
 * @param {Object} params
 * @param {OidcAuthenticationServiceRegistry} params.oidcAuthenticationServiceRegistry
 * @return {Promise<OidcAuthenticationService[]|null>}
 */
const getAllIdentityProviders = async function ({ oidcAuthenticationServiceRegistry }) {
  return oidcAuthenticationServiceRegistry.getAllOidcProviderServices();
};

export { getAllIdentityProviders };
