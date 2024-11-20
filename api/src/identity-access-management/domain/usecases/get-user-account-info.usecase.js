import { UserAccountInfo } from '../models/UserAccountInfo.js';

const getUserAccountInfo = async ({ userId, userRepository, privacyUsersApiRepository }) => {
  const user = await userRepository.get(userId);

  const canSelfDeleteAccount = await privacyUsersApiRepository.canSelfDeleteAccount({ userId });

  return new UserAccountInfo({
    id: user.id,
    email: user.email,
    username: user.username,
    canSelfDeleteAccount,
  });
};

export { getUserAccountInfo };
