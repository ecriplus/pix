/**
 * @typedef {function} getAuthorizationUrl
 * @param {Object} params
 * @param {string} params.identityProvider
 * @param {RequestedApplication} params.requestedApplication
 * @param {OidcAuthenticationServiceRegistry} params.oidcAuthenticationServiceRegistry
 * @return {Promise<string>}
 */
async function getAuthorizationUrl({ identityProvider, requestedApplication, oidcAuthenticationServiceRegistry }) {
  await oidcAuthenticationServiceRegistry.loadOidcProviderServices();
  await oidcAuthenticationServiceRegistry.configureReadyOidcProviderServiceByCode(identityProvider);

  const oidcAuthenticationService = oidcAuthenticationServiceRegistry.getOidcProviderServiceByCode({
    identityProviderCode: identityProvider,
    requestedApplication,
  });

  return oidcAuthenticationService.getAuthorizationUrl();
}

export { getAuthorizationUrl };
