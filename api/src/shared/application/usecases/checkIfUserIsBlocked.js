import * as userRepository from '../../../identity-access-management/infrastructure/repositories/user.repository.js';
import { UserIsBlocked, UserIsTemporaryBlocked } from '../../domain/errors.js';
import * as userLoginRepository from '../../infrastructure/repositories/user-login-repository.js';

const execute = async function (emailOrUsername) {
  const foundUserLogin = await userLoginRepository.findByUsername(emailOrUsername);

  if (!foundUserLogin) return;

  const foundUser = await userRepository.get(foundUserLogin.userId);

  const isLoginFailureWithUsername = emailOrUsername === foundUser.username;

  if (foundUserLogin.isUserMarkedAsBlocked()) {
    throw new UserIsBlocked({ isLoginFailureWithUsername });
  }

  if (foundUserLogin.isUserMarkedAsTemporaryBlocked()) {
    throw new UserIsTemporaryBlocked({
      isLoginFailureWithUsername,
      blockingDurationMs: foundUserLogin.computeBlockingDurationMs(),
    });
  }
};

export { execute };
