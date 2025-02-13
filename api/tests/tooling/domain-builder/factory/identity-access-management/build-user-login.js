import { UserLogin } from '../../../../../src/identity-access-management/domain/models/UserLogin.js';

export function buildUserLogin({
  id = 123,
  userId = 456,
  failureCount = 0,
  temporaryBlockedUntil = null,
  blockedAt = null,
  createdAt = null,
  updatedAt = null,
  lastLoggedAt = null,
} = {}) {
  return new UserLogin({
    id,
    userId,
    failureCount,
    temporaryBlockedUntil,
    blockedAt,
    createdAt,
    updatedAt,
    lastLoggedAt,
  });
}
