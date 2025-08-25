import lodash from 'lodash';

const { get } = lodash;

import { ForbiddenAccess, UserNotFoundError } from '../../../shared/domain/errors.js';
import { logger } from '../../../shared/infrastructure/utils/logger.js';
import { NON_OIDC_IDENTITY_PROVIDERS } from '../constants/identity-providers.js';
import { PasswordExpirationToken } from '../models/PasswordExpirationToken.js';

const updateExpiredPassword = async function ({
  passwordExpirationToken,
  newPassword,
  cryptoService,
  authenticationMethodRepository,
  userRepository,
}) {
  const { userId } = PasswordExpirationToken.decode(passwordExpirationToken);

  let foundUser;
  try {
    foundUser = await userRepository.get(userId);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      logger.warn('Trying to change his password with incorrect user id');
    }
    throw error;
  }

  const authenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
    userId: foundUser.id,
    identityProvider: NON_OIDC_IDENTITY_PROVIDERS.PIX.code,
  });

  const shouldChangePassword = get(authenticationMethod, 'authenticationComplement.shouldChangePassword');

  if (!shouldChangePassword) {
    throw new ForbiddenAccess();
  }

  const hashedPassword = await cryptoService.hashPassword(newPassword);

  await authenticationMethodRepository.updatePassword({
    userId: foundUser.id,
    hashedPassword,
  });

  return foundUser.username ?? foundUser.email;
};

export { updateExpiredPassword };
