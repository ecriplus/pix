/**
 * @typedef {function} getRedirectLogoutUrl
 * @param {Object} params
 * @param {string} params.identityProvider
 * @param {string} params.logoutUrlUUID
 * @param {string} params.userId
 * @param {OidcAuthenticationServiceRegistry} params.oidcAuthenticationServiceRegistry
 * @return {Promise<string>}
 */
async function getRedirectLogoutUrl({
  identityProvider,
  logoutUrlUUID,
  userId,
  requestedApplication,
  oidcAuthenticationServiceRegistry,
}) {
  const oidcAuthenticationService = await oidcAuthenticationServiceRegistry.getOidcProviderServiceByCode({
    identityProviderCode: identityProvider,
    requestedApplication,
  });

  return oidcAuthenticationService.getRedirectLogoutUrl({
    logoutUrlUUID,
    userId,
  });
}

export { getRedirectLogoutUrl };
