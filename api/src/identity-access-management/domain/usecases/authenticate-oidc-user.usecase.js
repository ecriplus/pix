import { PIX_ADMIN } from '../../../authorization/domain/constants.js';
import { ForbiddenAccess } from '../../../shared/domain/errors.js';

/**
 * @typedef {function} authenticateOidcUser
 * @param {Object} params
 * @param {string} params.target
 * @param {string} params.code
 * @param {string} params.identityProviderCode
 * @param {string} params.nonce
 * @param {string} params.sessionState
 * @param {string} params.state
 * @param {string} params.audience
 * @param {AuthenticationSessionService} params.authenticationSessionService
 * @param {OidcAuthenticationServiceRegistry} params.oidcAuthenticationServiceRegistry
 * @param {AdminMemberRepository} params.adminMemberRepository
 * @param {AuthenticationMethodRepository} params.authenticationMethodRepository
 * @param {UserLoginRepository} params.userLoginRepository
 * @param {UserRepository} params.userRepository
 * @return {Promise<{isAuthenticationComplete: boolean, givenName: string, familyName: string, authenticationKey: string, email: string}|{isAuthenticationComplete: boolean, pixAccessToken: string, logoutUrlUUID: string}>}
 */
async function authenticateOidcUser({
  target,
  code,
  state,
  iss,
  identityProviderCode,
  nonce,
  sessionState,
  audience,
  authenticationSessionService,
  oidcAuthenticationServiceRegistry,
  adminMemberRepository,
  authenticationMethodRepository,
  userLoginRepository,
  userRepository,
}) {
  await oidcAuthenticationServiceRegistry.loadOidcProviderServices();
  await oidcAuthenticationServiceRegistry.configureReadyOidcProviderServiceByCode(identityProviderCode);

  const oidcAuthenticationService = oidcAuthenticationServiceRegistry.getOidcProviderServiceByCode({
    identityProviderCode,
    target,
  });

  const sessionContent = await oidcAuthenticationService.exchangeCodeForTokens({
    code,
    state,
    iss,
    nonce,
    sessionState,
  });
  const userInfo = await oidcAuthenticationService.getUserInfo({
    idToken: sessionContent.idToken,
    accessToken: sessionContent.accessToken,
  });
  const user = await userRepository.findByExternalIdentifier({
    externalIdentityId: userInfo.externalIdentityId,
    identityProvider: oidcAuthenticationService.identityProvider,
  });

  if (!user) {
    const authenticationKey = await authenticationSessionService.save({ userInfo, sessionContent });
    const { firstName: givenName, lastName: familyName, email } = userInfo;
    return { authenticationKey, givenName, familyName, email, isAuthenticationComplete: false };
  }

  await _assertUserWithPixAdminAccess({ target, userId: user.id, adminMemberRepository });

  await _updateAuthenticationMethodWithComplement({
    userInfo,
    userId: user.id,
    sessionContent,
    oidcAuthenticationService,
    authenticationMethodRepository,
  });

  const pixAccessToken = oidcAuthenticationService.createAccessToken({ userId: user.id, audience });

  let logoutUrlUUID;
  if (oidcAuthenticationService.shouldCloseSession) {
    logoutUrlUUID = await oidcAuthenticationService.saveIdToken({
      idToken: sessionContent.idToken,
      userId: user.id,
    });
  }

  await userLoginRepository.updateLastLoggedAt({ userId: user.id });

  return { pixAccessToken, logoutUrlUUID, isAuthenticationComplete: true };
}

export { authenticateOidcUser };

async function _updateAuthenticationMethodWithComplement({
  userInfo,
  userId,
  sessionContent,
  oidcAuthenticationService,
  authenticationMethodRepository,
}) {
  const authenticationComplement = oidcAuthenticationService.createAuthenticationComplement({
    userInfo,
    sessionContent,
  });

  return await authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider({
    authenticationComplement,
    userId,
    identityProvider: oidcAuthenticationService.identityProvider,
  });
}

async function _assertUserWithPixAdminAccess({ target, userId, adminMemberRepository }) {
  if (target === PIX_ADMIN.TARGET) {
    const adminMember = await adminMemberRepository.get({ userId });
    if (!adminMember?.hasAccessToAdminScope) {
      throw new ForbiddenAccess(
        'User does not have the rights to access the application',
        'PIX_ADMIN_ACCESS_NOT_ALLOWED',
      );
    }
  }
}
