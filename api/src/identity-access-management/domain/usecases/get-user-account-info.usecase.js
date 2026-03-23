import { featureToggles } from '../../../shared/infrastructure/feature-toggles/index.js';
import { UserAccountInfo } from '../models/UserAccountInfo.js';

const getUserAccountInfo = async ({
  userId,
  userRepository,
  privacyUsersApiRepository,
  authenticationMethodRepository,
}) => {
  const user = await userRepository.get(userId);

  const canSelfDeleteAccount = await privacyUsersApiRepository.canSelfDeleteAccount({ userId });
  const oidcAuthenticationMethods = await authenticationMethodRepository.findAllOidcAuthenticationMethodsByUser({
    userId,
  });
  const addEmailConnectionMethodEnabled = await featureToggles.get('addEmailConnectionMethodEnabled');
  return new UserAccountInfo({
    id: user.id,
    email: user.email,
    username: user.username,
    canSelfDeleteAccount,
    oidcAuthenticationMethods,
    addEmailConnectionMethodEnabled,
  });
};

export { getUserAccountInfo };
