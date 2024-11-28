import * as privacyUsersApi from '../../../privacy/application/api/users-api.js';

const anonymizeUser = async ({
  userId,
  anonymizedByUserId,
  anonymizedByUserRole,
  client,
  dependencies = { privacyUsersApi },
}) => {
  return dependencies.privacyUsersApi.anonymizeUser({ userId, anonymizedByUserId, anonymizedByUserRole, client });
};

const canSelfDeleteAccount = async ({ userId, dependencies = { privacyUsersApi } }) => {
  return dependencies.privacyUsersApi.canSelfDeleteAccount({ userId });
};

export { anonymizeUser, canSelfDeleteAccount };
