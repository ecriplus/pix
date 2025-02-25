import { PIX_ADMIN, PIX_ORGA } from '../../../authorization/domain/constants.js';
import { ForbiddenAccess, UserNotFoundError } from '../../../shared/domain/errors.js';
import { NON_OIDC_IDENTITY_PROVIDERS } from '../constants/identity-providers.js';
import { createWarningConnectionEmail } from '../emails/create-warning-connection.email.js';
import { MissingOrInvalidCredentialsError, PasswordNotMatching, UserShouldChangePasswordError } from '../errors.js';
import { RefreshToken } from '../models/RefreshToken.js';

const authenticateUser = async function ({
  password,
  scope,
  source,
  username,
  localeFromCookie,
  refreshTokenRepository,
  pixAuthenticationService,
  tokenService,
  userRepository,
  userLoginRepository,
  authenticationMethodRepository,
  adminMemberRepository,
  emailRepository,
  emailValidationDemandRepository,
  audience,
}) {
  try {
    const foundUser = await pixAuthenticationService.getUserByUsernameAndPassword({
      username,
      password,
      userRepository,
    });

    if (foundUser.shouldChangePassword) {
      const passwordResetToken = tokenService.createPasswordResetToken(foundUser.id);
      throw new UserShouldChangePasswordError(undefined, passwordResetToken);
    }

    await _checkUserAccessScope(scope, foundUser, adminMemberRepository);

    const refreshToken = RefreshToken.generate({ userId: foundUser.id, source, audience });
    await refreshTokenRepository.save({ refreshToken });

    const { accessToken, expirationDelaySeconds } = await tokenService.createAccessTokenFromUser({
      userId: foundUser.id,
      source,
      audience,
    });

    foundUser.setLocaleIfNotAlreadySet(localeFromCookie);
    if (foundUser.hasBeenModified) {
      await userRepository.update({ id: foundUser.id, locale: foundUser.locale });
    }
    const userLogin = await userLoginRepository.findByUserId(foundUser.id);
    if (foundUser.email && userLogin?.shouldSendConnectionWarning()) {
      const validationToken = !foundUser.emailConfirmedAt
        ? await emailValidationDemandRepository.save(foundUser.id)
        : null;
      await emailRepository.sendEmailAsync(
        createWarningConnectionEmail({
          locale: foundUser.locale,
          email: foundUser.email,
          firstName: foundUser.firstName,
          validationToken,
        }),
      );
    }
    await userLoginRepository.updateLastLoggedAt({ userId: foundUser.id });

    await authenticationMethodRepository.updateLastLoggedAtByIdentityProvider({
      userId: foundUser.id,
      identityProvider: NON_OIDC_IDENTITY_PROVIDERS.PIX.code,
    });

    return { accessToken, refreshToken: refreshToken.value, expirationDelaySeconds };
  } catch (error) {
    if (error instanceof UserNotFoundError || error instanceof PasswordNotMatching) {
      throw new MissingOrInvalidCredentialsError();
    } else {
      throw error;
    }
  }
};

async function _checkUserAccessScope(scope, user, adminMemberRepository) {
  if (scope === PIX_ORGA.SCOPE && !user.isLinkedToOrganizations()) {
    throw new ForbiddenAccess(PIX_ORGA.NOT_LINKED_ORGANIZATION_MSG);
  }

  if (scope === PIX_ADMIN.SCOPE) {
    const adminMember = await adminMemberRepository.get({ userId: user.id });
    if (!adminMember?.hasAccessToAdminScope) {
      throw new ForbiddenAccess(PIX_ADMIN.NOT_ALLOWED_MSG);
    }
  }
}

export { authenticateUser };
