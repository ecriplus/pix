const authenticationServiceRegistry = require('../../../domain/services/authentication/authentication-service-registry');
const get = require('lodash/get');
const authenticationRegistry = require('../../../domain/services/authentication/authentication-service-registry');
const AuthenticationMethod = require('../../../domain/models/AuthenticationMethod');
const usecases = require('../../../domain/usecases');
const { UnauthorizedError } = require('../../http-errors');
const config = require('../../../config');

module.exports = {
  async getRedirectLogoutUrl(request, h) {
    const userId = request.auth.credentials.userId;
    const { identity_provider: identityProvider, logout_url_uuid: logoutUrlUUID } = request.query;
    const oidcAuthenticationService = authenticationServiceRegistry.lookupAuthenticationService(identityProvider);
    const redirectLogoutUrl = await oidcAuthenticationService.getRedirectLogoutUrl({
      userId,
      logoutUrlUUID,
    });

    return h.response({ redirectLogoutUrl }).code(200);
  },

  async getAuthenticationUrl(request, h) {
    const { identity_provider: identityProvider } = request.query;
    const oidcAuthenticationService = authenticationRegistry.lookupAuthenticationService(identityProvider);
    const result = oidcAuthenticationService.getAuthenticationUrl({ redirectUri: request.query['redirect_uri'] });
    return h.response(result).code(200);
  },

  async authenticateOidcUser(request) {
    const {
      code,
      identity_provider: identityProvider,
      redirect_uri: redirectUri,
      state_sent: stateSent,
      state_received: stateReceived,
    } = request.payload;
    let authenticatedUserId;
    if (!config.featureToggles.isSsoAccountReconciliationEnabled) {
      authenticatedUserId =
        identityProvider === AuthenticationMethod.identityProviders.POLE_EMPLOI
          ? get(request.auth, 'credentials.userId')
          : undefined;
    }
    const oidcAuthenticationService = authenticationRegistry.lookupAuthenticationService(identityProvider);

    const result = await usecases.authenticateOidcUser({
      authenticatedUserId,
      code,
      redirectUri,
      stateReceived,
      stateSent,
      oidcAuthenticationService,
    });

    if (result.isAuthenticationComplete) {
      return {
        access_token: result.pixAccessToken,
        logout_url_uuid: result.logoutUrlUUID,
      };
    } else {
      const message = "L'utilisateur n'a pas de compte Pix";
      const responseCode = 'SHOULD_VALIDATE_CGU';
      const meta = { authenticationKey: result.authenticationKey };
      throw new UnauthorizedError(message, responseCode, meta);
    }
  },
};
