/**
 * @typedef {function} getReadyIdentityProviders
 * @param {Object} params
 * @param {RequestedApplication} params.requestedApplication
 * @param {OidcAuthenticationServiceRegistry} params.oidcAuthenticationServiceRegistry
 * @return {Promise<OidcAuthenticationService[]|null>}
 */
const getReadyIdentityProviders = async function ({ requestedApplication, oidcAuthenticationServiceRegistry }) {
  await oidcAuthenticationServiceRegistry.loadOidcProviderServices();

  return oidcAuthenticationServiceRegistry.getReadyOidcProviderServicesByRequestedApplication(requestedApplication);
};

export { getReadyIdentityProviders };
