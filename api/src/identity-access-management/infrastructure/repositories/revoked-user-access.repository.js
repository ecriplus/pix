import { config } from '../../../../src/shared/config.js';
import { temporaryStorage } from '../../../../src/shared/infrastructure/key-value-storages/index.js';
import { UserIdIsRequiredError } from '../../domain/errors.js';
import { RevokeUntilMustBeAnInstanceOfDate } from '../../domain/errors.js';
import { RevokedUserAccess } from '../../domain/models/RevokedUserAccess.js';

const revokedUserAccessTemporaryStorage = temporaryStorage.withPrefix('revoked-user-access:');
const revokedUserAccessLifespanMs = config.authentication.revokedUserAccessLifespanMs;

const saveForUser = async function (userId, revokeUntil) {
  if (!userId) {
    throw new UserIdIsRequiredError();
  }

  if (!(revokeUntil instanceof Date)) {
    throw new RevokeUntilMustBeAnInstanceOfDate();
  }

  await revokedUserAccessTemporaryStorage.save({
    key: userId,
    value: Math.floor(revokeUntil.getTime() / 1000),
    expirationDelaySeconds: revokedUserAccessLifespanMs / 1000,
  });
};

const findByUserId = async function (userId) {
  const value = await revokedUserAccessTemporaryStorage.get(userId);
  return new RevokedUserAccess(value);
};

export const revokedUserAccessRepository = { saveForUser, findByUserId };
