import { AlreadyRegisteredEmailError } from '../../../../src/shared/domain/errors.js';
import { UnauthorizedError } from '../../../shared/application/http-errors.js';
import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NON_OIDC_IDENTITY_PROVIDERS } from '../constants/identity-providers.js';
import { createAccountCreationEmail } from '../emails/create-account-creation.email.js';
import { AuthenticationMethod } from '../models/AuthenticationMethod.js';

const upgradeToRealUser = withTransaction(async function ({
  userId,
  userAttributes,
  password,
  anonymousUserToken,
  locale,
  anonymousUserTokenRepository,
  userRepository,
  authenticationMethodRepository,
  emailValidationDemandRepository,
  emailRepository,
  cryptoService,
}) {
  const anonymousUser = await userRepository.getFullById(userId);
  if (!anonymousUser.isAnonymous) {
    throw new UnauthorizedError('User must be anonymous', 'NOT_ANONYMOUS_USER');
  }

  const existingUsersWithEmail = await userRepository.findAnotherUserByEmail(userId, userAttributes.email);
  if (existingUsersWithEmail.length > 0) {
    throw new AlreadyRegisteredEmailError();
  }

  const storedAnonymousUserToken = await anonymousUserTokenRepository.find(userId);
  if (storedAnonymousUserToken !== anonymousUserToken) {
    throw new UnauthorizedError('Anonymous token is invalid', 'INVALID_ANONYMOUS_TOKEN');
  }

  const realUser = anonymousUser.convertAnonymousToRealUser(userAttributes);
  await userRepository.update(realUser.mapToDatabaseDto());

  const hashedPassword = await cryptoService.hashPassword(password);
  const authenticationMethod = new AuthenticationMethod({
    userId,
    identityProvider: NON_OIDC_IDENTITY_PROVIDERS.PIX.code,
    authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
      password: hashedPassword,
      shouldChangePassword: false,
    }),
  });
  await authenticationMethodRepository.create({ authenticationMethod });

  const token = await emailValidationDemandRepository.save(realUser.id);
  await emailRepository.sendEmailAsync(
    createAccountCreationEmail({
      locale,
      email: realUser.email,
      firstName: realUser.firstName,
      token,
    }),
  );
  return realUser;
});

export { upgradeToRealUser };
