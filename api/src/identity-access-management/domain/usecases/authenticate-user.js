import { PIX_ADMIN, PIX_ORGA } from '../../../authorization/domain/constants.js';
import { ForbiddenAccess, UserNotFoundError } from '../../../shared/domain/errors.js';
import { NON_OIDC_IDENTITY_PROVIDERS } from '../constants/identity-providers.js';
import { createWarningConnectionEmail } from '../emails/create-warning-connection.email.js';
import { MissingOrInvalidCredentialsError, PasswordNotMatching, UserShouldChangePasswordError } from '../errors.js';
import { RefreshToken } from '../models/RefreshToken.js';

const authenticateUser = async function ({
  password,
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
  requestedApplication,
}) {
  try {
    const user = await pixAuthenticationService.getUserByUsernameAndPassword({
      username,
      password,
      userRepository,
    });

    if (user.shouldChangePassword) {
      const passwordResetToken = tokenService.createPasswordResetToken(user.id);
      throw new UserShouldChangePasswordError(undefined, passwordResetToken);
    }

    await _assertUserHasAccessToApplication({ requestedApplication, user, adminMemberRepository });

    const refreshToken = RefreshToken.generate({ userId: user.id, source, audience });
    await refreshTokenRepository.save({ refreshToken });

    const { accessToken, expirationDelaySeconds } = await tokenService.createAccessTokenFromUser({
      userId: user.id,
      source,
      audience,
    });

    user.setLocaleIfNotAlreadySet(localeFromCookie);
    if (user.hasBeenModified) {
      await userRepository.update({ id: user.id, locale: user.locale });
    }

    const userLogin = await userLoginRepository.findByUserId(user.id);
    if (user.email && userLogin?.shouldSendConnectionWarning()) {
      const validationToken = !user.emailConfirmedAt ? await emailValidationDemandRepository.save(user.id) : null;
      await emailRepository.sendEmailAsync(
        createWarningConnectionEmail({
          locale: user.locale,
          email: user.email,
          firstName: user.firstName,
          validationToken,
        }),
      );
    }
    await userLoginRepository.updateLastLoggedAt({ userId: user.id });

    await authenticationMethodRepository.updateLastLoggedAtByIdentityProvider({
      userId: user.id,
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

async function _assertUserHasAccessToApplication({ requestedApplication, user, adminMemberRepository }) {
  if (requestedApplication.isPixOrga && !user.isLinkedToOrganizations()) {
    throw new ForbiddenAccess(PIX_ORGA.NOT_LINKED_ORGANIZATION_MSG);
  }

  if (requestedApplication.isPixAdmin) {
    const adminMember = await adminMemberRepository.get({ userId: user.id });
    if (!adminMember?.hasAccessToAdminScope) {
      throw new ForbiddenAccess(PIX_ADMIN.NOT_ALLOWED_MSG);
    }
  }
}

export { authenticateUser };
